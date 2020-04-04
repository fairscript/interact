import {createChoiceFromStrings} from '../parsing_helpers'

export const aBinaryLogicalOperator = createChoiceFromStrings(['&&', '||'])