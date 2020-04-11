import {GroupAggregationOperation} from '../../parsing/aggregation/group_aggregation_operation_parsing'
import {generateGetPartOfKey} from './key_generation'
import {generateAggregateColumn} from './aggregate_column_generation'
import {generateCountOperation} from '../count_generation'

export function generateGroupAggregationOperation(
    partOfKeyToTableAndProperty: { [part: string]: [string, string] },
    parameterToTable: { [parameter: string]: string },
    operation: GroupAggregationOperation): string {

    switch (operation.kind) {
        case 'get-part-of-key':
            return generateGetPartOfKey(partOfKeyToTableAndProperty, operation.part)
        case 'aggregate-column':
            return generateAggregateColumn(parameterToTable, operation)
        case 'count-operation':
            return generateCountOperation()
    }
}