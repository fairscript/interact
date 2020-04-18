import {GroupAggregationOperation} from '../aggregation/group_aggregation_operation_parsing'

export interface SingleGroupAggregationOperationSelection {
    kind: 'single-group-aggregation-operation-selection'
    parameterNameToTableAlias: { [parameter: string]: string },
    operation: GroupAggregationOperation
}

export function createSingleGroupAggregationOperationSelection(
    parameterNameToTableAlias: { [parameter: string]: string },
    operation: GroupAggregationOperation): SingleGroupAggregationOperationSelection {

    return {
        kind: 'single-group-aggregation-operation-selection',
        parameterNameToTableAlias,
        operation
    }
}