import {extractLambdaString} from '../lambda_string_extraction'
import {
    createDictionaryParser, createFunctionInvocationChoice, createKeyValuePairParser,
    createObjectPropertyParser,
    dot,
    identifier
} from './javascript_parsing'
import * as getParameterNames from 'get-parameter-names'
import * as A from 'arcsecond'
import {
    ColumnOperation,
    createAggregate,
    createAlias,
    createGet, Get
} from '../column_operations'
import {createFindTableIndex} from './table_index'
import {PartOfKey} from './get_key_parsing'

const operations = ['avg', 'count', 'min', 'max', 'sum']

function createAccessKeyParser(keyParameterName) {
    const value = createObjectPropertyParser([keyParameterName])

    const keyValuePair = createKeyValuePairParser(value)

    return keyValuePair
        .map(([alias, [object, partOfKey]]) => [partOfKey, alias])
}

function createAggregateColumnParser(objectParameterNames) {
    const columnAggregation = A.sequenceOf([identifier, dot, createFunctionInvocationChoice(operations)])
        .map(([property, dot, operation]) => [property, operation])

    const value = createObjectPropertyParser(objectParameterNames, columnAggregation)
    const keyValuePair = createKeyValuePairParser(value)

    const findTableIndex = createFindTableIndex(objectParameterNames)

    return keyValuePair
        .map(([alias, [object, [property, aggregation]]]) => createAlias(createAggregate(aggregation, createGet(findTableIndex(object), property)), alias))
}

function mapPartOfKeyAliasToGet(key: PartOfKey[]): { [id: string]: Get } {
    return key.reduce((acc, item) => {
        acc[item.alias] = item.get

        return acc
    }, {})
}

function createAggregationParser(f: Function, key: PartOfKey[]) {
    const parameterNames = getParameterNames(f)

    const keyParameterName = parameterNames[0]
    const partOfKeyAliasToGetMap = mapPartOfKeyAliasToGet(key)
    const accessKeyParser = createAccessKeyParser(keyParameterName)
        .map(([partOfKey, alias]) => createAlias(partOfKeyAliasToGetMap[partOfKey], alias))

    const objectParameterNames = parameterNames.slice(1)
    const aggregateColumnParser = createAggregateColumnParser(objectParameterNames)

    const keyValuePair = A.choice([
        accessKeyParser,
        aggregateColumnParser
    ])

    return createDictionaryParser(keyValuePair)
}

export function parseAggregation(f: Function, key: PartOfKey[]): ColumnOperation[] {
    const lambdaString = extractLambdaString(f)

    const parser = createAggregationParser(f, key)

    const result = parser.run(lambdaString).result

    return result
}