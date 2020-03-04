import {Aggregatable} from '../queries/aggregation'
import {
    createDictionaryParser, createChoiceFromStrings,
    createObjectPropertyParser, createTableFieldAggregationParser, joinWithCommaWhitespace
} from './parsing'
import * as getParameterNames from 'get-parameter-names'
import * as A from 'arcsecond'
import {extractLambdaString} from './lambda_string'

function createKeyParser(parameterName: string, properties: Array<string>) {
    return createObjectPropertyParser(
        A.str(parameterName),
        createChoiceFromStrings(properties))
}

export function parseAggregate<T, K, A>(
    keyProperties2TableFields: {[keyProperty: string]: string},
    aggregation: (k: K, x: Aggregatable<T>) => A): string {

    const parameterNames = getParameterNames(aggregation)

    const keyParameterName = parameterNames[0]
    const keyProperties = Object.keys(keyProperties2TableFields)
    const keyParser = createKeyParser(keyParameterName, keyProperties)
        .map(([keyParameter, keyProperty]) => keyProperties2TableFields[keyProperty])

    const tableParameterNames = parameterNames.slice(1)
    const aggregationParser = createTableFieldAggregationParser(tableParameterNames, ['avg', 'count', 'max', 'min', 'sum'])
        .map(([tableField, functionName]) => `${functionName.toUpperCase()}(${tableField})`)

    const dictionaryParser = createDictionaryParser(A.choice([keyParser, aggregationParser]))
        .map(pairs => joinWithCommaWhitespace(pairs.map(([alias, field]) => `${field} AS ${alias}`)))

    const lambdaString = extractLambdaString(aggregation)

    return dictionaryParser.run(lambdaString).result

}

export function generateAggregate<T, K, A>(
    keyProperties2TableFields: {[keyProperty: string]: string},
    aggregation: (k: K, x: Aggregatable<T>) => A): string {
    return 'SELECT ' + parseAggregate(keyProperties2TableFields, aggregation)
}