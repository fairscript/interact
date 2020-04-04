import * as A from 'arcsecond'
import {aBinaryLogicalOperator} from '../javascript/operator_parsing'
import {BooleanExpression} from './boolean_expression_parsing'

export interface TailItem {
    operator: '&&' | '||',
    expression: BooleanExpression
    kind: 'tail-item'
}

export function createTailItem(operator: '&&' | '||', expression: BooleanExpression): TailItem {
    return {
        operator,
        expression,
        kind: 'tail-item'
    }
}

export function createTailParser(itemParser) {
    return A.many1(
        A.sequenceOf([
            A.optionalWhitespace,
            aBinaryLogicalOperator,
            A.optionalWhitespace,
            itemParser
        ])
            .map(([ws1, operator, ws2, comparison]) => ([operator, comparison]))
    )
}

export function createAnd(expression: BooleanExpression): TailItem {
    return createTailItem('&&', expression)
}

export function createOr(expression: BooleanExpression): TailItem {
    return createTailItem('||', expression)
}

export interface Concatenation {
    head: BooleanExpression,
    tail: TailItem[],
    kind: 'concatenation'
}

export function createConcatenation(head: BooleanExpression, tail: TailItem[]): Concatenation {
    return {
        head,
        tail,
        kind: 'concatenation'
    }
}