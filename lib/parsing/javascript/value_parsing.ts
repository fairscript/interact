import * as A from 'arcsecond'

// String
import {doubleQuote, minus, plus, singleQuote} from './single_character_parsing'
import {join} from '../parsing_helpers'

export const aString =
    A.choice([
        A.sequenceOf([singleQuote, A.many(A.choice([A.str("\\'"), A.anythingExcept(singleQuote)])), singleQuote]),
        A.sequenceOf([doubleQuote, A.many(A.choice([A.str("\\'"), A.anythingExcept(doubleQuote)])), doubleQuote])
    ]).map(([quote1, chars, quote2]) => quote1 + join(chars) + quote2)

// Number
export const plusOrMinus = A.choice([plus, minus])
export const optionalPositiveOrNegative = A.possibly(plusOrMinus).map(x => x === null ? '' : x)
export const integerWithoutSign = A.choice([A.char('0'), A.regex(/^[1-9][0-9]*/)])
export const integer = A.sequenceOf([optionalPositiveOrNegative, integerWithoutSign]).map(join).map(parseInt)
export const floatWithoutSign = A.choice([A.regex(/^[1-9][0-9]+.[0-9]+/), A.regex(/^0.[0-9]+/)])
export const float = A.sequenceOf([optionalPositiveOrNegative, floatWithoutSign]).map(join).map(parseFloat)
export const aNumber = A.choice([integer, float])

// String or Number
export function createValueParser(stringParser = aString, numberParser = aNumber) {
    return A.choice([stringParser, numberParser])
}