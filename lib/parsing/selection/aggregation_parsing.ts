import * as A from 'arcsecond'
import { createGetFromParameter, GetFromParameter } from '../../column_operations'
import {Key} from '../get_key_parsing'
import {parseLambdaFunction} from '../lambda_parsing'
import {
    createParameterlessFunctionInvocation,
    createParameterlessFunctionInvocationChoice
} from '../javascript/invocation_parsing'
import {
    createDictionaryParser,
    createKeyValuePairParser,
    createNamedObjectPropertyParser
} from '../javascript/record_parsing'
import {identifier} from '../javascript/identifier_parsing'
import {dot} from '../javascript/single_character_parsing'

export interface GetPartOfKey {
    kind: 'get-part-of-key',
    part: string,
}

export function createGetPartOfKey(part: string): GetPartOfKey {
    return {
        kind: 'get-part-of-key',
        part
    }
}

type ColumnAggregationOperation = 'avg' | 'min' | 'max' | 'sum'

export interface AggregateColumn {
    kind: 'aggregate-column'
    aggregation: ColumnAggregationOperation
    get: GetFromParameter
}

export function createAggregateColumn(aggregation: ColumnAggregationOperation, get: GetFromParameter): AggregateColumn {
    return {
        kind: 'aggregate-column',
        aggregation,
        get
    }
}

export interface CountRowsInGroup {
    kind: 'count-rows-in-group'
}

export function createCountRowsInGroup(): CountRowsInGroup {
    return {
        kind: 'count-rows-in-group'
    }
}

function createCountParser(countParameter) {
    return createParameterlessFunctionInvocation(countParameter)
        .map(() => createCountRowsInGroup())
}

function createGetPartOfKeyParser(keyParameterName) {
    return createNamedObjectPropertyParser([keyParameterName])
        .map(([object, partOfKey]) => createGetPartOfKey(partOfKey))
}

function createAggregateColumnParser(objectParameterNames) {
    const columnAggregation = A.sequenceOf([identifier, dot, createParameterlessFunctionInvocationChoice(['avg', 'min', 'max', 'sum'])])
        .map(([property, dot, operation]) => [property, operation])

    return createNamedObjectPropertyParser(objectParameterNames, columnAggregation)
        .map(([object, [property, aggregation]]) => createAggregateColumn(aggregation, createGetFromParameter(object, property)))
}

function createAggregationParser(keyParameterName: string, objectParameterNames: string[], countParameter: string|null) {
    const valueParsers = []

    if (countParameter != null) {
        const countParser = createCountParser(countParameter)
        valueParsers.push(countParser)
    }

    const accessKeyParser = createGetPartOfKeyParser(keyParameterName)
    const aggregateColumnParser = createAggregateColumnParser(objectParameterNames)

    valueParsers.push(accessKeyParser, aggregateColumnParser)

    const keyValuePairParsers = A.choice(valueParsers.map(valueParser => {
        return createKeyValuePairParser(valueParser)
    }))

    return createDictionaryParser(keyValuePairParsers)
}

export type AggregationOperation = GetPartOfKey|AggregateColumn|CountRowsInGroup

export interface Aggregation {
    kind: 'aggregation',
    partOfKeyToTableAndProperty: {[partOfKey: string]: [string, string]},
    parameterToTable: {[partOfKey: string]: string},

    operations: [string, AggregationOperation][]
}

export function createAggregation(
    partOfKeyToTableAndProperty: {[partOfKey: string]: [string, string]},
    parameterToTable: {[partOfKey: string]: string},
    operations: [string, AggregationOperation][]): Aggregation {

    return {
        kind: 'aggregation',
        partOfKeyToTableAndProperty,
        parameterToTable,
        operations
    }
}

export function parseAggregation(f: Function, key: Key, numberOfTables: number): Aggregation {
    const { parameters, expression } = parseLambdaFunction(f)

    const partOfKeyToTableAndProperty = key.parts.reduce(
        (acc, part) => {
            acc[part.alias] = [key.parameterToTable[part.get.parameter], part.get.property]

            return acc
        },
        {}
    )

    const keyParameterName = parameters[0]
    const objectParameterNames = parameters.slice(1, numberOfTables+1)
    const countParameter = parameters.length > 1 + numberOfTables ? parameters[parameters.length - 1]: null

    const parameterToTable = objectParameterNames.reduce(
        (acc, name, index) => {
            acc[name] = `t${index+1}`
            return acc
        },
        {})

    const parser = createAggregationParser(keyParameterName, objectParameterNames, countParameter)

    const parsingResult = parser.run(expression)
    const operations = parsingResult.result

    const aggregation = createAggregation(partOfKeyToTableAndProperty, parameterToTable, operations)

    return aggregation
}