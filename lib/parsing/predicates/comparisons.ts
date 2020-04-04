import {GetProvided} from '../get_provided_parsing'
import {GetColumn} from '../get_column_parsing'
import {JsComparisonOperator} from './comparison_operators'
import {InsideParentheses} from './inside_parentheses'
import {Literal} from '../values/literal'
import {Null} from '../values/null'

export type ValueExpression = InsideParentheses | Literal | GetColumn | GetProvided | Null

export interface Comparison {
    left: ValueExpression,
    operator: JsComparisonOperator,
    right: ValueExpression,
    kind: 'comparison'
}

export function createComparison(left: ValueExpression, operator: JsComparisonOperator, right: ValueExpression): Comparison {
    return {
        left,
        operator,
        right,
        kind: 'comparison'
    }
}

export function createEqual(left: ValueExpression, right: ValueExpression): Comparison {
    return createComparison(left, '===', right)
}

export function createNotEqual(left: ValueExpression, right: ValueExpression): Comparison {
    return createComparison(left, '!==', right)
}

export function createGreaterThan(left: ValueExpression, right: ValueExpression): Comparison {
    return createComparison(left, '>', right)
}

export function createGreaterThanOrEqual(left: ValueExpression, right: ValueExpression): Comparison {
    return createComparison(left, '>=', right)
}

export function createLessThan(left: ValueExpression, right: ValueExpression): Comparison {
    return createComparison(left, '<', right)
}

export function createLessThanOrEqual(left: ValueExpression, right: ValueExpression): Comparison {
    return createComparison(left, '<=', right)
}