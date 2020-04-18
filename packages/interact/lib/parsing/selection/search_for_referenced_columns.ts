import {AggregateColumn} from '../aggregation/aggregate_column_parsing'
import {SubselectStatement} from '../../statements/subselect_statement'
import {GetColumn} from '../value_expressions/get_column_parsing'

export function findReferencedColumns(operation: GetColumn | AggregateColumn | SubselectStatement): GetColumn[] {
    const referencedColumns: GetColumn[] = []

    switch (operation.kind) {
        case 'get-column':
            referencedColumns.push(operation)
            break
        case 'aggregate-column':
            const {aggregated} = operation

            switch (aggregated.kind) {
                case 'get-column':
                    referencedColumns.push(aggregated)
                    break
                case 'implicitly-convert-boolean-to-integer':
                    referencedColumns.push(aggregated.get)
                    break
            }
    }

    return referencedColumns
}
