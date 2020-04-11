import {BooleanExpression} from './boolean_expression_parsing'

export interface InsideParentheses {
    inside: BooleanExpression
    kind: 'inside'
}

export function createInsideParentheses(inside: BooleanExpression): InsideParentheses {
    return {
        inside,
        kind: 'inside'
    }
}