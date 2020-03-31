import * as A from 'arcsecond'
import {aComparisonOperator} from '../javascript/operator_parsing'
import {JsComparisonOperator} from './comparison_operators'

export function mapDoubleEqualityToTripleEquality(operator: JsComparisonOperator): JsComparisonOperator {
    switch (operator) {
        case '==':
            return '==='
        case '!=':
            return '!=='
        default:
            return operator
    }
}

export function createComparisonParser(sideParser) {
    return A.sequenceOf(
        [
            sideParser,
            A.optionalWhitespace,
            aComparisonOperator.map(mapDoubleEqualityToTripleEquality),
            A.optionalWhitespace,
            sideParser
        ])
        .map(([left, ws1, operator, ws2, right]) => ([left, operator, right]))
}
