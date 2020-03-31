import {AggregateColumn} from '../aggregation/aggregate_column_parsing'
import {SubselectStatement} from '../../select_statement'
import {GetColumn} from '../get_column_parsing'

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
