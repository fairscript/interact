import {generateCountOperation} from '../count_generation'
import {joinWithCommaWhitespace} from '../../parsing/parsing_helpers'
import {generateAlias} from '../alias_generation'
import {TableAggregationSelection} from '../../parsing/selection/table_aggregation_selection_parsing'
import {generateAggregateColumn,} from './group_aggregation_selection_generation'
import {TableAggregationOperation} from '../../parsing/aggregation/table_aggregation_operation_parsing'


export function generateTableAggregationOperation(
    parameterToTable: { [parameter: string]: string }, operation: TableAggregationOperation): string {

    switch (operation.kind) {
        case 'aggregate-column':
            return generateAggregateColumn(parameterToTable, operation)
        case 'count-operation':
            return generateCountOperation()
    }
}

export function generateTableAggregationSelection(aliasEscape: string|null, aggregation: TableAggregationSelection): string {
    const {parameterToTable, operations} = aggregation

    const columnOperations = operations
        .map(([alias, operation]) => {
            const generatedAggregationOperation = generateTableAggregationOperation(parameterToTable, operation)

            return generateAlias(aliasEscape, generatedAggregationOperation, alias)
        })

    return joinWithCommaWhitespace(columnOperations)
}