import {generateGetColumn} from '../value_expressions/get_column_generation'
import {SingleColumnSelection} from '../../parsing/selection/single_column_selection_parsing'
import {generateAggregateColumn} from '../aggregation/aggregate_column_generation'

export function generateSingleColumnSelection(selection: SingleColumnSelection): string {
    const {parameterNameToTableAlias, operation} = selection

    switch (operation.kind) {
        case 'get-column':
            return generateGetColumn(parameterNameToTableAlias, operation)
        case 'aggregate-column':
            return generateAggregateColumn(parameterNameToTableAlias, operation)
    }
}