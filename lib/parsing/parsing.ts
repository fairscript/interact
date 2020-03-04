import {NestedArray} from './parenthesis_parsing'
import * as A from 'arcsecond'
import * as toSnakeCase from 'js-snakecase'
import computeTableAliases from './table_aliases'

export function parseSegments(parser, segments: NestedArray, result: string = ''): string {
    return segments.reduce((acc, segment) => {

        if (Array.isArray(segment)) {
            return acc + parseSegments(parser, segment)
        }
        else {
            if (segment.startsWith(')') && segment.endsWith('(')) {
                const between = segment.substring(1, segment.length - 1)
                return acc + parseSegments(parser, [')', between, '('])
            }
            else {

                const parsingResult = parser.run(segment)

                if (parsingResult.isError) {
                    throw parsingResult.error
                }

                return acc + parsingResult.result
            }
        }
    }, result)
}

// Join arrays
export const join = (array: string[]) => array.join('')
export const joinWithCommaWhitespace = (array: string[]) => array.join(', ')
export const joinWithNewLine = (array: string[]) => array.join('\n')
export const joinWithDot = (array: string[]) => array.join('.')
export const joinNonNullWithNewLine = (array: string[]) => joinWithNewLine(array.filter(x => x !== null))

// Single characters
export const dot = A.char('.')
export const comma = A.char(',')
export const colon = A.char(':')
export const underscore = A.char('_')
export const dollarSign = A.char('$')
export const singleQuote = A.char('\'')
export const openingParenthesis = A.char('(')
export const closingParenthesis = A.char(')')
export const openingBracket = A.char('{')
export const closingBracket = A.char('}')
export const plus = A.char('+')
export const minus = A.char('-')

// Identifier
// A JavaScript identifier must start with a letter, underscore (_), or dollar sign ($). Subsequent characters can also be digits (0–9).
// Source: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Grammar_and_types
const startOfIdentifier = A.choice([A.letter, underscore, dollarSign])
const endOfIdentifier = A.many(A.choice([A.letter, underscore, dollarSign, A.digit])).map(join)
export const identifier = A.sequenceOf([startOfIdentifier, endOfIdentifier]).map(join)

// Values
export const aString = A.between(singleQuote)(singleQuote)(A.many(A.choice([A.str("\\'"), A.anythingExcept(singleQuote)])).map(join)).map(x => '\'' + x + '\'')
export const positiveOrNegative = A.choice([plus, minus])
export const optionalPositiveOrNegative = A.possibly(positiveOrNegative).map(x => x === null ? '' : x)
export const integerWithoutSign = A.choice([A.char('0'), A.regex(/^[1-9][0-9]*/)])
export const integer = A.sequenceOf([optionalPositiveOrNegative, integerWithoutSign]).map(join)
export const floatWithoutSign = A.choice([A.regex(/^[1-9][0-9]+.[0-9]+/), A.regex(/^0.[0-9]+/)])
export const float = A.sequenceOf([optionalPositiveOrNegative, floatWithoutSign]).map(join)
export const aNumber = A.choice([integer, float])
export const value = A.choice([aString, aNumber])

// Operators
export const logicalOperators = A.choice([
    A.str('&&').map(() => 'AND'),
    A.str('||').map(() => 'OR')
])

export const comparisonOperators = A.choice([
    A.choice([
        A.str('==='),
        A.str('==')
    ]).map(() => '=')
])

// Table fields
export function createObjectPropertyParser(objectParser, propertyParser) {
    return A.sequenceOf([objectParser, dot, propertyParser])
        .map(([obj, dot, prop]) => [obj, prop])
}

export function createChoiceFromStrings(names: Array<string>) {
    return A.choice(names.map(A.str))
}

const invocation = A.str('()')

function createFunctionInvocationChoice(functionNames: Array<string>) {
    return A.sequenceOf([createChoiceFromStrings(functionNames), invocation])
        .map(([functionName, invocation]) => functionName)
}

export function createTableFieldParser(tableParameterNames: Array<string>) {
    // Compute a dictionary that maps parameter names to table aliases
    const tableAliases = computeTableAliases(tableParameterNames)

    const objectParser = createChoiceFromStrings(tableParameterNames)
    const propertyParser = identifier

    return createObjectPropertyParser(objectParser, propertyParser)
        .map(([obj, prop]) => {
            return [ tableAliases[obj], toSnakeCase(prop) ]
        })
        .map(joinWithDot)
}

export function createTableFieldAggregationParser(tableParameterNames: Array<string>, operations: Array<string>) {
    const tableFieldParser = createTableFieldParser(tableParameterNames)

    const aggregationParser = A.sequenceOf([tableFieldParser, dot, createFunctionInvocationChoice(operations)])
        .map(([tableField, dot, functionName]) => [ tableField, functionName ])

    return aggregationParser
}

export function createDictionaryParser(valueParser) {

    const keyValuePair = A.sequenceOf([identifier, A.optionalWhitespace, colon, A.optionalWhitespace, valueParser])
        .map(([alias, ws1, colon, ws2, field]) => [alias, field])

    const keyValuePairs = A.sepBy(A.sequenceOf([A.optionalWhitespace, comma, A.optionalWhitespace]))(keyValuePair)

    const dictionary = A.sequenceOf([openingBracket, A.optionalWhitespace, keyValuePairs, A.optionalWhitespace, closingBracket])
        .map(([o, ws1, pairs, ws2, c]) => pairs)

    const dictionaryInParentheses = A.sequenceOf([openingParenthesis, dictionary, closingParenthesis])
        .map(([o, d, c]) => d)

    return dictionaryInParentheses
}