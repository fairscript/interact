import * as A from 'arcsecond'
import {aBinaryLogicalOperator} from '../javascript_parsing'
import {PredicateExpression} from '../predicate_parsing'

export interface TailItem {
    operator: '&&' | '||',
    expression: PredicateExpression
    kind: 'tail-item'
}

export function createTailItem(operator: '&&' | '||', expression: PredicateExpression): TailItem {
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