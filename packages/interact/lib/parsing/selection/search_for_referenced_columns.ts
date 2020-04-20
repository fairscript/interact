import {AggregateColumn} from '../aggregation/aggregate_column_parsing'
import {GetColumn} from '../value_expressions/get_column_parsing'
import {
    AdaptBooleanAsInteger,
    ConvertToInteger
} from '../conversions'

export function findReferencedColumn(operation: GetColumn | ConvertToInteger | AggregateColumn | AdaptBooleanAsInteger): GetColumn {
    switch (operation.kind) {
        case 'get-column':
            return operation
        case 'convert-to-integer':
        case 'adapt-boolean-as-integer':
            return findReferencedColumn(operation.get)
        case 'aggregate-column':
            return findReferencedColumn(operation.aggregated)
    }
}
