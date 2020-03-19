import {PredicateExpression} from '../predicate_parsing'

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