import * as A from 'arcsecond'
import {JsComparisonOperator, jsComparisonOperators} from './comparison_operators'
import {createChoiceFromStrings} from '../parsing_helpers'

export const aComparisonOperator = createChoiceFromStrings(jsComparisonOperators)


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

export function createComparisonParser(valueExpressionParser) {
    return A.sequenceOf(
        [
            valueExpressionParser,
            A.optionalWhitespace,
            aComparisonOperator.map(mapDoubleEqualityToTripleEquality),
            A.optionalWhitespace,
            valueExpressionParser
        ])
        .map(([left, ws1, operator, ws2, right]) => ([left, operator, right]))
}
