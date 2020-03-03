import {extractLambdaString} from './lambda_string'
import {
    closingBracket,
    closingParenthesis, colon,
    comma,
    createTableFieldParser,
    identifier, joinWithCommaWhitespace,
    openingBracket,
    openingParenthesis
} from './parsing'
import * as A from 'arcsecond'

function createMapParser<T, U>(f: (x: T) => U) {
    const tableField = createTableFieldParser(f)

    const key = identifier
    const value = tableField
    const keyValuePair = A.sequenceOf([key, A.optionalWhitespace, colon, A.optionalWhitespace, value]).map(([alias, ws1, colon, ws2, field]) => `${field} AS ${alias}`)
    const keyValuePairs = A.sepBy(A.sequenceOf([A.optionalWhitespace, comma, A.optionalWhitespace]))(keyValuePair).map(joinWithCommaWhitespace)
    const dictionary = A.sequenceOf([openingBracket, A.optionalWhitespace, keyValuePairs, A.optionalWhitespace, closingBracket]).map(([o, ws1, pairs, ws2, c]) => pairs)
    const dictionaryInParentheses = A.sequenceOf([openingParenthesis, dictionary, closingParenthesis]).map(([o, d, c]) => d)

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