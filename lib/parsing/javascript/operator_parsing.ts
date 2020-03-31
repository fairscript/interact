// Operators
import {createChoiceFromStrings} from '../parsing_helpers'
import {jsComparisonOperators} from '../predicates/comparison_operators'

export const aBinaryLogicalOperator = createChoiceFromStrings(['&&', '||'])
export const aComparisonOperator = createChoiceFromStrings(jsComparisonOperators)
