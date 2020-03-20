import * as A from 'arcsecond'
import {
    aNumber,
    aString,
    closingParenthesis,
    createValueParser,
    identifier,
    openingParenthesis
} from './javascript_parsing'
import {createConstant, createGetFromParameter} from '../column_operations'
import {Comparison, createComparison, createComparisonParser} from './predicate/comparison'
import {Concatenation, createConcatenation, createTailItem, createTailItemsParser} from './predicate/concatenation'
import {createInsideParentheses, InsideParentheses} from './predicate/inside_parentheses'
import normalizeQuotes from './quote_normalization'
import {parseLambdaFunction} from './lambda_parsing'
import {createObjectPropertyParser} from './javascript/record_parsing'


export type PredicateExpression = InsideParentheses | Concatenation | Comparison

export function createPredicateExpressionParser() {
    const comparisonParser = createComparisonParser(
        createValueParser(aString.map(x => x.slice(1, x.length - 1)), aNumber)
            .map(v => createConstant(v)),
        createObjectPropertyParser(identifier, identifier)
            .map(([object, property]) => createGetFromParameter(object, property))
    ).map(([left, operator, right]) => createComparison(left, operator, right))

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

export function parsePredicate(f: Function): PredicateExpression {
    const { expression } = parseLambdaFunction(f)

    const predicateExpressionParser = createPredicateExpressionParser()

    // Replace double quotes around string with single quotes
    const withNormalizedQuotes = normalizeQuotes(expression)

    // Escape parentheses?
    // Escape binary operators?

    const predicateExpression = predicateExpressionParser.run(withNormalizedQuotes).result

    return predicateExpression
}