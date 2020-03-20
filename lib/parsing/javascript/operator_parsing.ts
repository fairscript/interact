// Operators
import {createChoiceFromStrings} from '../parsing_helpers'

export const aBinaryLogicalOperator = createChoiceFromStrings(['&&', '||'])
export const aComparisonOperator = createChoiceFromStrings(['===', '==', '>=', '<=', '>', '<'])