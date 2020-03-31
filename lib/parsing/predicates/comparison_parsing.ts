import * as A from 'arcsecond'
import {aComparisonOperator} from '../javascript/operator_parsing'

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