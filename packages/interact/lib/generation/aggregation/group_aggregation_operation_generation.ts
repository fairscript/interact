import {GroupAggregationOperation} from '../../parsing/aggregation/group_aggregation_operation_parsing'
import {generateGetPartOfKey} from './key_generation'
import {generateAggregateColumn} from './aggregate_column_generation'
import {generateCountOperation} from '../count_generation'
import {Key} from '../../parsing/get_key_parsing'
import {generateSubselectStatement} from '../subselect_generation'

export function generateGroupAggregationOperation(
    namedParameterPrefix: string,
    key: Key,
    parameterToTable: { [parameter: string]: string },
    operation: GroupAggregationOperation): string {

    switch (operation.kind) {
        case 'get-part-of-key':
            return generateGetPartOfKey(key, operation.part)
        case 'aggregate-column':
            return generateAggregateColumn(parameterToTable, operation)
        case 'count-operation':
            return generateCountOperation()
        case 'subselect-statement':
            return generateSubselectStatement(namedParameterPrefix, operation.selection, operation.tableName, operation.filters)
    }
}