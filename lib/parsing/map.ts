import {extractLambdaString} from './lambda_string'
import {createDictionaryParser, createTableFieldParser} from './parsing'
import * as A from 'arcsecond'

function createMapParser<T, U>(f: (x: T) => U) {
    const tableField = createTableFieldParser(f)

    const dictionaryInParentheses = createDictionaryParser(tableField, true)

    return A.choice([dictionaryInParentheses, tableField])
}

export function parseMap<T, U>(f: (x: T) => U): string {
    const parser = createMapParser(f)

    const lambdaString = extractLambdaString(f)

    const parsingResult = parser.run(lambdaString)

    return parsingResult.result
}

export function generateMap<T, U>(f: (x: T) => U): string {
    return 'SELECT ' + parseMap(f)
}