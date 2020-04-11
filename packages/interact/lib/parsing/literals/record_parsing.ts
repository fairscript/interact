import * as A from 'arcsecond'

import {identifier} from '../identifier_parsing'
import {
    closingBracket,
    closingParenthesis,
    colon,
    comma,
    dot,
    openingBracket,
    openingParenthesis
} from './single_character_parsing'
import {createChoiceFromStrings} from '../parsing_helpers'
import {join} from '../../join'


export function createObjectPropertyParser(objectParser, propertyParser) {
    return A.sequenceOf([objectParser, dot, propertyParser])
        .map(([object, dot, property]) => [object, property])
}

export function createNamedObjectPropertyParser(objectNames: string[], propertyParser = identifier) {
    return createObjectPropertyParser(createChoiceFromStrings(objectNames), propertyParser)
}

export function createNestedObjectPropertyParser(objectParser, propertyParser) {
    const deepPropertyParser = A.many1(
            A.sequenceOf([dot, propertyParser])
                .map(join)
        )
        .map(join)
        .map(x => x.slice(1).split('.'))

    return A.sequenceOf([objectParser, deepPropertyParser])
}

export function createKeyValuePairParser(valueParser) {
    return A.sequenceOf([identifier, A.optionalWhitespace, colon, A.optionalWhitespace, valueParser])
        .map(([key, ws1, colon, ws2, value]) => [key, value])
}

export function createKeyValueArrayParser(valueParser) {
    return A.sepBy(A.sequenceOf([A.optionalWhitespace, comma, A.optionalWhitespace]))(createKeyValuePairParser(valueParser))
}

export function createRecordParser(valueParser) {
    return A.coroutine(function* () {
        yield openingBracket
        yield A.optionalWhitespace

        const record = yield createKeyValueArrayParser(valueParser)

        yield A.optionalWhitespace
        yield closingBracket

        return record
    })
}

export function createRecordInParenthesesParser(valueParser) {
    return A.coroutine(function* () {
        yield openingParenthesis
        yield A.optionalWhitespace

        const record = yield createRecordParser(valueParser)

        yield A.optionalWhitespace
        yield closingParenthesis

        yield A.endOfInput

        return record
    })
}