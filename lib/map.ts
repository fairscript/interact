import computeTableAliases from './table_aliases'
import {extractLambdaString} from './lambda_string'
import {
    closingBracket,
    closingParenthesis, colon,
    comma,
    createTableFieldParser,
    identifier, joinWithWhitespace,
    openingBracket,
    openingParenthesis
} from './parsing'
import * as A from 'arcsecond'
import * as getParameterNames from 'get-parameter-names'

export function parseMap<T, U>(f: (x: T) => U): string {
    const lambdaString = extractLambdaString(f)

    const parameterNames = getParameterNames(f)

    const tableAliases = computeTableAliases(parameterNames)

    const tableField = createTableFieldParser(tableAliases)

    const key = identifier
    const value = tableField
    const keyValuePair = A.sequenceOf([key, A.optionalWhitespace, colon, A.optionalWhitespace, value]).map(([alias, ws1, colon, ws2, field]) => `${field} AS ${alias}`)
    const keyValuePairs = A.sepBy(A.sequenceOf([A.optionalWhitespace, comma, A.optionalWhitespace]))(keyValuePair).map(joinWithWhitespace)
    const dictionary = A.sequenceOf([openingBracket, A.optionalWhitespace, keyValuePairs, A.optionalWhitespace, closingBracket]).map(([o, ws1, pairs, ws2, c]) => pairs)
    const dictionaryInParentheses = A.sequenceOf([openingParenthesis, dictionary, closingParenthesis]).map(([o, d, c]) => d)

    const parser = A.choice([dictionaryInParentheses, tableField])

    const parsingResult = parser.run(lambdaString)

    return parsingResult.result
}

export function generateMap<T, U>(f: (x: T) => U): string {
    return 'SELECT ' + parseMap(f)
}