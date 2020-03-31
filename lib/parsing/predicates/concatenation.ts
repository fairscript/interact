import * as A from 'arcsecond'
import {aBinaryLogicalOperator} from '../javascript/operator_parsing'
import {Predicate} from './predicate_parsing'

export interface TailItem {
    operator: '&&' | '||',
    expression: Predicate
    kind: 'tail-item'
}

export function createTailItem(operator: '&&' | '||', expression: Predicate): TailItem {
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

export function createAnd(expression: Predicate): TailItem {
    return createTailItem('&&', expression)
}

export function createOr(expression: Predicate): TailItem {
    return createTailItem('||', expression)
}

export interface Concatenation {
    head: Predicate,
    tail: TailItem[],
    kind: 'concatenation'
}

export function createConcatenation(head: Predicate, tail: TailItem[]): Concatenation {
    return {
        head,
        tail,
        kind: 'concatenation'
    }
}