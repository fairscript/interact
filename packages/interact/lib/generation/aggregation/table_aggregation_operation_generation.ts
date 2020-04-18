import {TableAggregationOperation} from '../../parsing/aggregation/table_aggregation_operation_parsing'
import {generateAggregateColumn} from './aggregate_column_generation'
import {generateCountOperation} from '../count_generation'

export function generateTableAggregationOperation(
    generateConvertToInt: (getColumn: string) => string,
    parameterToTable: { [parameter: string]: string },
    operation: TableAggregationOperation): string {

    switch (operation.kind) {
        case 'aggregate-column':
            return generateAggregateColumn(generateConvertToInt, parameterToTable, operation)
        case 'count-operation':
            return generateCountOperation()
    }
}