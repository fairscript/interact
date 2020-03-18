import {extractLambdaString} from '../lambda_string_extraction'
import {
    createDictionaryParser, createParameterlessFunctionInvocationChoice, createKeyValuePairParser,
    createNamedObjectPropertyParser,
    dot,
    identifier
} from './javascript_parsing'
import * as getParameterNames from 'get-parameter-names'
import * as A from 'arcsecond'
import { createGetFromParameter, GetFromParameter } from '../column_operations'
import {Key} from './get_key_parsing'

export interface Aggregate {
    kind: 'aggregate'
    aggregation: 'avg' | 'count' | 'min' | 'max' | 'sum'
    get: GetFromParameter
}

export function createAggregate(aggregation: 'avg' | 'count' | 'min' | 'max' | 'sum', get: GetFromParameter): Aggregate {
    return {
        kind: 'aggregate',
        aggregation,
        get
    }
}

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

function createAccessKeyParser(keyParameterName) {
    const value = createNamedObjectPropertyParser([keyParameterName])

    const keyValuePair = createKeyValuePairParser(value)

    return keyValuePair
        .map(([alias, [object, partOfKey]]) => [alias, createGetPartOfKey(partOfKey)])
}

function createAggregateColumnParser(objectParameterNames) {
    const columnAggregation = A.sequenceOf([identifier, dot, createParameterlessFunctionInvocationChoice(['avg', 'count', 'min', 'max', 'sum'])])
        .map(([property, dot, operation]) => [property, operation])

    const value = createNamedObjectPropertyParser(objectParameterNames, columnAggregation)
    const keyValuePair = createKeyValuePairParser(value)

    return keyValuePair
        .map(([alias, [object, [property, aggregation]]]) => [alias, createAggregate(aggregation, createGetFromParameter(object, property))])
}

function createAggregationParser(keyParameterName: string, objectParameterNames: string[]) {
    const accessKeyParser = createAccessKeyParser(keyParameterName)
    const aggregateColumnParser = createAggregateColumnParser(objectParameterNames)

    const keyValuePair = A.choice([
        accessKeyParser,
        aggregateColumnParser
    ])

    return createDictionaryParser(keyValuePair)
}

export interface Aggregation {
    kind: 'aggregation',
    partOfKeyToTableAndProperty: {[partOfKey: string]: [string, string]},
    parameterToTable: {[partOfKey: string]: string},

    operations: [string, GetPartOfKey|Aggregate][]
}

export function createAggregation(
    partOfKeyToTableAndProperty: {[partOfKey: string]: [string, string]},
    parameterToTable: {[partOfKey: string]: string},
    operations: [string, GetPartOfKey|Aggregate][]): Aggregation {

    return {
        kind: 'aggregation',
        partOfKeyToTableAndProperty,
        parameterToTable,
        operations
    }
}

export function parseAggregation(f: Function, key: Key): Aggregation {
    const parameterNames = getParameterNames(f)

    const partOfKeyToTableAndProperty = key.parts.reduce(
        (acc, part) => {
            acc[part.alias] = [key.parameterToTable[part.get.parameter], part.get.property]

            return acc
        },
        {}
    )

    // The first parameter of the function represents the key.
    const keyParameterName = parameterNames[0]
    // The remaining parameters represent tables.
    const objectParameterNames = parameterNames.slice(1)

    const parameterToTable = objectParameterNames.reduce(
        (acc, name, index) => {
            acc[name] = `t${index+1}`
            return acc
        },
        {})

    const parser = createAggregationParser(keyParameterName, objectParameterNames)

    const lambdaString = extractLambdaString(f)

    const operations = parser.run(lambdaString).result

    const aggregation = createAggregation(partOfKeyToTableAndProperty, parameterToTable, operations)

    return aggregation
}