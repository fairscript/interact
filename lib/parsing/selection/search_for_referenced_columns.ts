import {GetColumn} from '../../column_operations'
import {AggregateColumn} from '../aggregation/aggregate_column_parsing'
import {SubselectStatement} from '../../select_statement'

export function findReferencedColumns(operation: GetColumn | AggregateColumn | SubselectStatement): GetColumn[] {
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
