import {Aggregatable} from '../queries/aggregate_table'
import {Aggregate, createAggregate, createAccessKey, createGet, createAlias} from './select_parsing'
import {extractLambdaString} from '../lambda_string_extraction'
import {
    createDictionaryParser, createFunctionInvocationChoice, createKeyValuePairParser,
    createObjectPropertyParser,
    dot,
    identifier
} from './javascript_parsing'
import * as getParameterNames from 'get-parameter-names'
import * as A from 'arcsecond'

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
        .map(([alias, [object, [property, aggregation]]]) => createAlias(createAggregate(aggregation, createGet(object, property)), alias))
}

function createParser<T, K, A>(f: (k: K, x: Aggregatable<T>) => A) {
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

export function parseAggregate<T, K, A>(f: (k: K, x: Aggregatable<T>) => A): Aggregate[] {
    const lambdaString = extractLambdaString(f)

    const parser = createParser(f)

    const result = parser.run(lambdaString).result

    return result
}