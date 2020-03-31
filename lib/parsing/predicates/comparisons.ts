import {mapJsComparisonOperatorToSqlComparisonOperator, SqlComparisonOperator} from './comparison_operators'
import {GetProvided} from '../get_provided_parsing'
import {GetColumn} from '../get_column_parsing'
import {Constant} from './side_parsing'

export type Side = Constant | GetColumn | GetProvided

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

export function createEqual(left: Side, right: Side): Comparison {
    return createComparison(left, '=', right)
}

export function createNotEqual(left: Side, right: Side): Comparison {
    return createComparison(left, '!=', right)
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