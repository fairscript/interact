import {AggregateColumn} from '../aggregation/aggregate_column_parsing'
import {findReferencedColumn} from './search_for_referenced_columns'
import {GetColumn} from '../value_expressions/get_column_parsing'

export interface SingleColumnSelection {
    kind: 'single-column-selection'
    parameterNameToTableAlias: { [parameter: string]: string }
    operation: GetColumn | AggregateColumn
    referencedColumn: GetColumn

}

export function createSingleColumnSelection(
    parameterNameToTableAlias: { [parameter: string]: string },
    operation: GetColumn | AggregateColumn): SingleColumnSelection {

    return {
        kind: 'single-column-selection',
        parameterNameToTableAlias,
        operation,
        referencedColumn: findReferencedColumn(operation)
    }
}