// Operators
import {createChoiceFromStrings} from '../parsing_helpers'
import {jsComparisonOperators} from '../booleanexpressions/comparison_operators'

export const aBinaryLogicalOperator = createChoiceFromStrings(['&&', '||'])
export const aComparisonOperator = createChoiceFromStrings(jsComparisonOperators)
