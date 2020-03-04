import {extractLambdaString} from './lambda_string'
import {createDictionaryParser, createTableFieldParser} from './parsing'

function createGetKeyParser<T, U>(f: (x: T) => U) {
    const tableField = createTableFieldParser(f)

    return createDictionaryParser(tableField, false)
}

export function parseGetKey<T, U>(f: (x: T) => U): string {
    const parser = createGetKeyParser(f)

    const lambdaString = extractLambdaString(f)

    const parsingResult = parser.run(lambdaString)

    return parsingResult.result
}

export function generateGroupBy<T, K>(f: (x: T) => K): string {
    return 'GROUP BY ' + parseGetKey(f)
}