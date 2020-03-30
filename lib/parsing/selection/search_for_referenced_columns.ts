import {GetColumn, Subselect} from '../../column_operations'
import {AggregateColumn} from '../aggregation/aggregate_column_parsing'

export function findReferencedColumns(operation: GetColumn | AggregateColumn | Subselect): GetColumn[] {
    const referencedColumns: GetColumn[] = []

    switch (operation.kind) {
        case 'get-column':
            referencedColumns.push(operation)
            break
        case 'aggregate-column':
            referencedColumns.push(operation.get)
    }

    return referencedColumns
}
