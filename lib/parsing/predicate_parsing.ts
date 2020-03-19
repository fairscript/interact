import * as A from 'arcsecond'
import {
    aNumber,
    aString,
    closingParenthesis,
    createObjectPropertyParser,
    createValueParser,
    identifier,
    openingParenthesis
} from './javascript_parsing'
import {createConstant, createGetFromParameter} from '../column_operations'
import {Comparison, createComparison, createComparisonParser} from './predicate/comparison'
import {Concatenation, createConcatenation, createTailItem, createTailItemsParser} from './predicate/concatenation'
import {createInsideParentheses, InsideParentheses} from './predicate/inside_parentheses'


export type PredicateExpression = InsideParentheses | Concatenation | Comparison

export function createPredicateExpressionParser() {
    const comparisonParser = createComparisonParser(
        createValueParser(aString.map(x => x.slice(1, x.length - 1)), aNumber).map(v => createConstant(v)),
        createObjectPropertyParser(identifier, identifier).map(([object, property]) => createGetFromParameter(object, property))
    ).map(([left, operator, right]) => createComparison(left, operator, right))

    const insideParser = A.recursiveParser(() => A.choice([concatenationParser, insideParenthesesParser, comparisonParser]))
    const insideParenthesesParser = A.sequenceOf([openingParenthesis, A.optionalWhitespace, insideParser, A.optionalWhitespace, closingParenthesis])
        .map(([op, ws1, inside, ws2, cp]) => createInsideParentheses(inside))

    const concatenationParser = A.sequenceOf([
        A.choice([insideParenthesesParser, comparisonParser]),
        createTailItemsParser(A.choice([insideParenthesesParser, comparisonParser]))
            .map(([operator, comparison]) => createTailItem(operator, comparison))
    ])
        .map(([head, tail]) => createConcatenation(head, tail))

    const predicateExpressionParser = A.choice([concatenationParser, insideParenthesesParser, comparisonParser])

    return predicateExpressionParser
}
