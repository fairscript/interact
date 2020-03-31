import * as A from 'arcsecond'
import normalizeQuotes from '../quote_normalization'
import {createInsideParentheses, InsideParentheses} from './inside_parentheses'
import {Concatenation, createConcatenation, createTailItem, createTailItemsParser} from './concatenation'
import {Comparison, createComparison} from './comparisons'
import {createComparisonParser} from './comparison_parsing'
import {closingParenthesis, openingParenthesis} from '../javascript/single_character_parsing'
import {createParameterizedSideParser, createParameterlessSideParser} from './side_parsing'

export function createPredicateParser(sideParser) {
    const comparisonParser = createComparisonParser(sideParser)
        .map(([left, operator, right]) => createComparison(left, operator, right))

    const insideParser = A.recursiveParser(() => A.choice([concatenationParser, insideParenthesesParser, comparisonParser]))
    const insideParenthesesParser = A.sequenceOf([openingParenthesis, A.optionalWhitespace, insideParser, A.optionalWhitespace, closingParenthesis])
        .map(([op, ws1, inside, ws2, cp]) => createInsideParentheses(inside))

    const concatenationParser = A.sequenceOf([
        A.choice([insideParenthesesParser, comparisonParser]),
        createTailItemsParser(A.choice([insideParenthesesParser, comparisonParser]))
            .map(items => items.map(([operator, expression]) => createTailItem(operator, expression)))
    ])
        .map(([head, tail]) => createConcatenation(head, tail))

    const predicateExpressionParser = A.choice([concatenationParser, insideParenthesesParser, comparisonParser])

    return predicateExpressionParser
}

export type Predicate = InsideParentheses | Concatenation | Comparison

export function parsePredicate(sideParser, expression: string): Predicate {
    // Replace double quotes around string with single quotes
    const withNormalizedQuotes = normalizeQuotes(expression)

    // Escape parentheses?
    // Escape binary operators?
    const predicateExpression = createPredicateParser(sideParser).run(withNormalizedQuotes).result

    return predicateExpression
}

export function parseParameterlessPredicate(tableParameters: string[], expression: string): Predicate {
    const sideParser = createParameterlessSideParser(tableParameters)

    const result = parsePredicate(sideParser, expression)

    return result
}

export function parseParameterizedPredicate(prefix: string, userProvidedParameter: string, tableParameters: string[], expression: string) {
    const sideParser = createParameterizedSideParser(prefix, userProvidedParameter, tableParameters)

    return parsePredicate(sideParser, expression)
}