import {extractLambdaString} from './lambda_string'
import {createDictionaryParser, createTableFieldParser, joinWithCommaWhitespace} from './parsing'
import * as A from 'arcsecond'
import * as getParameterNames from 'get-parameter-names'

function createMapParser<T, U>(f: (x: T) => U) {
    const tableParameterNames = getParameterNames(f)

    const tableField = createTableFieldParser(tableParameterNames)

    const dictionaryParser = createDictionaryParser(tableField)
        .map(pairs => joinWithCommaWhitespace(pairs.map(([alias, field]) => `${field} AS ${alias}`)))

    return A.choice([dictionaryParser, tableField])
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