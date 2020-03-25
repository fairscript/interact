import * as A from 'arcsecond'
import {createInsideParentheses, InsideParentheses} from './predicate/inside_parentheses'
import {Concatenation, createConcatenation, createTailItem, createTailItemsParser} from './predicate/concatenation'
import {Comparison, createComparison, createComparisonParser} from './predicate/comparison'
import {aNumber, aString, createValueParser} from './javascript/value_parsing'
import {createConstant, createGetColumn} from '../column_operations'
import {createNamedObjectPropertyParser} from './javascript/record_parsing'
import {identifier} from './javascript/identifier_parsing'
import {closingParenthesis, openingParenthesis} from './javascript/single_character_parsing'
import normalizeQuotes from './quote_normalization'
import {StringValueRecord} from '../record'
import {ParameterizedFilter} from './filtering/parameterized_filter_parsing'
import {ParameterlessFilter} from './filtering/parameterless_filter_parsing'

export function createConstantOrColumnSideParser(tableParameters: string[]) {
    return A.choice([
        createValueParser(aString.map(x => x.slice(1, x.length - 1)), aNumber)
            .map(v => createConstant(v)),
        createNamedObjectPropertyParser(tableParameters, identifier)
            .map(([object, property]) => createGetColumn(object, property))
    ])
}

export function createPredicateExpressionParser(sideParser) {
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

export type PredicateExpression = InsideParentheses | Concatenation | Comparison

export function parsePredicate(parser, expression: string): PredicateExpression {
    // Replace double quotes around string with single quotes
    const withNormalizedQuotes = normalizeQuotes(expression)

    // Escape parentheses?
    // Escape binary operators?
    const predicateExpression = parser.run(withNormalizedQuotes).result

    return predicateExpression
}

export type Filter = ParameterlessFilter|ParameterizedFilter