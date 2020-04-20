import {Key} from '../../parsing/get_key_parsing'
import {generateGroupAggregationOperation} from '../aggregation/group_aggregation_operation_generation'
import {SingleGroupAggregationOperationSelection} from '../../parsing/selection/single_group_aggregation_operation_selection'

export function generateSingleGroupAggregationSelection(
    aliasEscape: string|null,
    namedParameterPrefix: string,
    generateConvertToInt: (getColumn: string) => string,
    generateConvertToFloat: (getColumn: string) => string,
    selection: SingleGroupAggregationOperationSelection,
    key: Key): string {

    const {parameterNameToTableAlias, operation} = selection

    return generateGroupAggregationOperation(namedParameterPrefix, generateConvertToInt, generateConvertToFloat, key, parameterNameToTableAlias, operation)
}