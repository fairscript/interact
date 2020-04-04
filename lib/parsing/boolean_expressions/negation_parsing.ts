import * as A from 'arcsecond'
import {GetColumn} from '../value_expressions/get_column_parsing'
import {exclamationMark} from '../javascript/single_character_parsing'
import {GetProvided} from '../value_expressions/get_provided_parsing'
import {InsideParentheses} from './inside_parentheses'
import {Literal} from '../literals/literal'

export type Negatable = Literal|GetColumn|GetProvided|InsideParentheses

export interface Negation {
    negated: Negatable
    kind: 'negation'
}

export function createNegation(negated: Negatable): Negation {
    return {
        negated,
        kind: 'negation'
    }
}

export function createNegationParser(negatableParser) {
    return A.sequenceOf([A.many1(exclamationMark), negatableParser])
        .map(([exclamationMarks, negatable]) =>
            exclamationMarks.length % 2 == 0
                ? negatable
                : createNegation(negatable)
        )
}
