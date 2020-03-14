import {extractLambdaString} from '../lambda_string_extraction'
import {
    createDictionaryParser, createFunctionInvocationChoice, createKeyValuePairParser,
    createObjectPropertyParser,
    dot,
    identifier
} from './javascript_parsing'
import * as getParameterNames from 'get-parameter-names'
import * as A from 'arcsecond'
import {Aggregate, createAccessKey, createAggregate, createAlias, createGet} from '../column_operations'
import {AggregatableTable} from '../queries/one/aggregate_table'

const operations = ['avg', 'count', 'min', 'max', 'sum']

function createAccessKeyParser(keyParameterName) {
    const value = createObjectPropertyParser([keyParameterName])

    const keyValuePair = createKeyValuePairParser(value)

    return keyValuePair
        .map(([alias, [object, property]]) => createAccessKey(property, alias))
}

function createAggregatePropertyParser(objectParameterNames) {
    const propertyAggregation = A.sequenceOf([identifier, dot, createFunctionInvocationChoice(operations)])
        .map(([property, dot, operation]) => [property, operation])

    const value = createObjectPropertyParser(objectParameterNames, propertyAggregation)
    const keyValuePair = createKeyValuePairParser(value)

    return keyValuePair
        .map(([alias, [object, [property, aggregation]]]) => createAlias(createAggregate(aggregation, createGet(1, property)), alias))
}

function createAggregationParser<T, K, A>(f: (k: K, x: AggregatableTable<T>) => A) {
    const parameterNames = getParameterNames(f)

    const keyParameterName = parameterNames[0]
    const accessPropertyParser = createAccessKeyParser(keyParameterName)

    const objectParameterNames = parameterNames.slice(1)
    const aggregatePropertyParser = createAggregatePropertyParser(objectParameterNames)

    const keyValuePair = A.choice([
        accessPropertyParser,
        aggregatePropertyParser
    ])

    return createDictionaryParser(keyValuePair)
}

export function parseAggregation<T, K, A>(f: (key: K, table: AggregatableTable<T>) => A): Aggregate[] {
    const lambdaString = extractLambdaString(f)

    const parser = createAggregationParser(f)

    const result = parser.run(lambdaString).result

    return result
}