import * as A from 'arcsecond'

import {identifier} from './identifier_parsing'
import {
    closingBracket,
    closingParenthesis,
    colon,
    comma,
    openingBracket,
    openingParenthesis
} from './single_character_parsing'

export function createKeyValuePairParser(valueParser) {
    return A.sequenceOf([identifier, A.optionalWhitespace, colon, A.optionalWhitespace, valueParser])
        .map(([key, ws1, colon, ws2, value]) => [key, value])
}

export function createDictionaryParser(keyValuePair) {
    const keyValuePairs = A.sepBy(A.sequenceOf([A.optionalWhitespace, comma, A.optionalWhitespace]))(keyValuePair)

    const dictionary = A.sequenceOf([openingBracket, A.optionalWhitespace, keyValuePairs, A.optionalWhitespace, closingBracket])
        .map(([o, ws1, pairs, ws2, c]) => pairs)

    const dictionaryInParentheses = A.sequenceOf([openingParenthesis, dictionary, closingParenthesis])
        .map(([o, d, c]) => d)

    return dictionaryInParentheses
}