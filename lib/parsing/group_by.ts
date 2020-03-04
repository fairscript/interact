import {extractLambdaString} from './lambda_string'
import {createDictionaryParser, createTableFieldParser, joinWithCommaWhitespace} from './parsing'
import * as getParameterNames from 'get-parameter-names'

function createGetKeyParser<T, U>(f: (x: T) => U) {
    const parameterNames = getParameterNames(f)

    const tableField = createTableFieldParser(parameterNames)

    return createDictionaryParser(tableField)
}

export function parseGetKey<T, U>(f: (x: T) => U): Array<[string, string]> {
    const parser = createGetKeyParser(f)

    const lambdaString = extractLambdaString(f)

    const parsingResult = parser.run(lambdaString)

    return parsingResult.result
}

export function generateGroupBy<T, K>(keyProperties2TableFields: Array<[string, string]>): string {
    return 'GROUP BY ' + joinWithCommaWhitespace(keyProperties2TableFields.map(([_, field]) => field))
}