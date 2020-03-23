import * as A from 'arcsecond'
import {Constant, GetColumn, GetParameter} from '../../column_operations'
import {aComparisonOperator} from '../javascript/operator_parsing'

export type SqlComparisonOperator = '=' | '>' | '>=' | '<' | '<='

function mapJsComparisonOperatorToSqlComparisonOperator(operator): SqlComparisonOperator {
    switch (operator) {
        case '===':
        case '==':
            return '='
        default:
            return operator
    }
}

export type Side = Constant | GetColumn | GetParameter

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

export function createEquality(left: Side, right: Side): Comparison {
    return createComparison(left, '=', right)
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

export function createComparisonParser(sideParser) {
    return A.sequenceOf(
        [
            sideParser,
            A.optionalWhitespace,
            aComparisonOperator,
            A.optionalWhitespace,
            sideParser
        ])
        .map(([left, ws1, operator, ws2, right]) => ([left, operator, right]))
}