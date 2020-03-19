import * as A from 'arcsecond'
import {
    aBinaryLogicalOperator,
    aComparisonOperator,
    aNumber,
    aString, closingParenthesis,
    createObjectPropertyParser,
    createValueParser,
    identifier,
    openingParenthesis
} from './javascript_parsing'
import {Constant, createConstant, createGetFromParameter, GetFromParameter} from '../column_operations'


export type SqlComparisonOperator = '='|'>'|'>='|'<'|'<='

function mapJsComparisonOperatorToSqlComparisonOperator(operator): SqlComparisonOperator {
    switch (operator) {
        case '===':
        case '==':
            return '='
        default:
            return operator
    }
}

export type Side = Constant|GetFromParameter

export interface Comparison {
    left: Side,
    operator: SqlComparisonOperator,
    right: Side,
    kind: 'comparison'
}

export function createComparison(left: Side, operator: SqlComparisonOperator, right: Side): Comparison {
    return {
        left,
        operator: mapJsComparisonOperatorToSqlComparisonOperator(operator),
        right,
        kind: 'comparison'
    }
}

export function createEquality(left: Side, right: Side): Comparison {
    return createComparison(left, '=', right)
}

export function createGreaterThan(left: Side, right: Side): Comparison {
    return createComparison(left, '>', right)
}

export function createGreaterThanOrEqualTo(left: Side, right: Side): Comparison {
    return createComparison(left, '>=', right)
}

export function createLessThan(left: Side, right: Side): Comparison {
    return createComparison(left, '<', right)
}

export function createLessThanOrEqualTo(left: Side, right: Side): Comparison {
    return createComparison(left, '<=', right)
}

export function createComparisonParser(valueParser, objectPropertyParser) {
    const valueOrObjectProperty = A.choice([valueParser, objectPropertyParser])

    return A.sequenceOf(
        [
            valueOrObjectProperty,
            A.optionalWhitespace,
            aComparisonOperator,
            A.optionalWhitespace,
            valueOrObjectProperty
        ])
        .map(([left, ws1, operator, ws2, right]) => ([left, operator, right]))
}

export function createAnd(expression: PredicateExpression): TailItem {
    return createTailItem('&&', expression)
}


export function createOr(expression: PredicateExpression): TailItem {
    return createTailItem('||', expression)
}

export interface Concatenation {
    head: PredicateExpression,
    tail: TailItem[],
    kind: 'concatenation'
}

export interface TailItem {
    operator: '&&'|'||',
    expression: PredicateExpression
    kind: 'tail-item'
}

export function createTailItem(operator: '&&'|'||', expression: PredicateExpression): TailItem {
    return {
        operator,
        expression,
        kind: 'tail-item'
    }
}

export function createTailItemsParser(side) {
    return A.many1(
        A.sequenceOf([
            A.optionalWhitespace,
            aBinaryLogicalOperator,
            A.optionalWhitespace,
            side
        ])
            .map(([ws1, operator, ws2, comparison]) => ([operator, comparison]))
    )
}

export interface InsideParentheses {
    inside: PredicateExpression
    kind: 'inside'
}

export function createInsideParentheses(inside: PredicateExpression): InsideParentheses {
    return {
        inside,
        kind: 'inside'
    }
}

export function createConcatenation(head: PredicateExpression, tail: TailItem[]): Concatenation {
    return {
        head,
        tail,
        kind: 'concatenation'
    }
}

export function createConcatenationParser(head, tailItems) {
    return A.sequenceOf([
        head,
        tailItems
    ])
}

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
