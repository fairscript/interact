import {GetProvided} from '../get_provided_parsing'
import {GetColumn} from '../get_column_parsing'
import {Constant, Null} from './side_parsing'
import {JsComparisonOperator} from './comparison_operators'
import {InsideParentheses} from './inside_parentheses'

export type Side = InsideParentheses | Constant | GetColumn | GetProvided | Null

export interface Comparison {
    left: Side,
    operator: JsComparisonOperator,
    right: Side,
    kind: 'comparison'
}

export function createComparison(left: Side, operator: JsComparisonOperator, right: Side): Comparison {
    return {
        left,
        operator,
        right,
        kind: 'comparison'
    }
}

export function createEqual(left: Side, right: Side): Comparison {
    return createComparison(left, '===', right)
}

export function createNotEqual(left: Side, right: Side): Comparison {
    return createComparison(left, '!==', right)
}

export function createGreaterThan(left: Side, right: Side): Comparison {
    return createComparison(left, '>', right)
}

export function createGreaterThanOrEqual(left: Side, right: Side): Comparison {
    return createComparison(left, '>=', right)
}

export function createLessThan(left: Side, right: Side): Comparison {
    return createComparison(left, '<', right)
}

export function createLessThanOrEqual(left: Side, right: Side): Comparison {
    return createComparison(left, '<=', right)
}