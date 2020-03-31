import {Predicate} from './predicate_parsing'

export interface InsideParentheses {
    inside: Predicate
    kind: 'inside'
}

export function createInsideParentheses(inside: Predicate): InsideParentheses {
    return {
        inside,
        kind: 'inside'
    }
}