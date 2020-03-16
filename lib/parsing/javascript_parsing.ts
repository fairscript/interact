import * as A from 'arcsecond'

// Join arrays
export const join = (array: string[]) => array.join('')
export const joinWithDot = (array: string[]) => array.join('.')
export const joinWithWhitespace = (array: string[]) => array.join(' ')
export const joinWithCommaWhitespace = (array: string[]) => array.join(', ')
export const joinWithNewLine = (array: string[]) => array.join('\n')

export function createChoiceFromStrings(names: Array<string>) {
    return A.choice(names.map(A.str))
}

// Single characters
export const dot = A.char('.')
export const comma = A.char(',')
export const colon = A.char(':')
export const underscore = A.char('_')
export const dollarSign = A.char('$')
export const singleQuote = A.char('\'')
export const doubleQuote = A.char('\"')
export const openingParenthesis = A.char('(')
export const closingParenthesis = A.char(')')
export const openingBracket = A.char('{')
export const closingBracket = A.char('}')
export const plus = A.char('+')
export const minus = A.char('-')

// Identifiers
// A JavaScript identifier must start with a letter, underscore (_), or dollar sign ($). Subsequent characters can also be digits (0–9).
// Source: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Grammar_and_types
const startOfIdentifier = A.choice([A.letter, underscore, dollarSign])
const endOfIdentifier = A.many(A.choice([A.letter, underscore, dollarSign, A.digit])).map(join)
export const identifier = A.sequenceOf([startOfIdentifier, endOfIdentifier]).map(join)

// Values
// String
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

// Operators
export const aBinaryLogicalOperator = createChoiceFromStrings(['&&', '||'])
export const aComparisonOperator = createChoiceFromStrings(['===', '==', '>=', '<=', '>', '<'])

// Object property
export function createObjectPropertyParser(objectNames: Array<string>, propertyParser = identifier) {
    return A.sequenceOf([createChoiceFromStrings(objectNames), dot, propertyParser])
        .map(([object, dot, property]) => [object, property])
}

export function createKeyValuePairParser(valueParser) {
    return A.sequenceOf([identifier, A.optionalWhitespace, colon, A.optionalWhitespace, valueParser])
        .map(([key, ws1, colon, ws2, value]) => [key, value])
}

// Dictionary
export function createDictionaryParser(keyValuePair) {
    const keyValuePairs = A.sepBy(A.sequenceOf([A.optionalWhitespace, comma, A.optionalWhitespace]))(keyValuePair)

    const dictionary = A.sequenceOf([openingBracket, A.optionalWhitespace, keyValuePairs, A.optionalWhitespace, closingBracket])
        .map(([o, ws1, pairs, ws2, c]) => pairs)

    const dictionaryInParentheses = A.sequenceOf([openingParenthesis, dictionary, closingParenthesis])
        .map(([o, d, c]) => d)

    return dictionaryInParentheses
}

// Function invocation
const invocation = A.str('()')

export function createFunctionInvocationChoice(functionNames: Array<string>) {
    return A.sequenceOf([createChoiceFromStrings(functionNames), invocation])
        .map(([functionName, invocation]) => functionName)
}