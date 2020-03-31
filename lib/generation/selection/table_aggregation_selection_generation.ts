import {joinWithCommaWhitespace} from '../../parsing/parsing_helpers'
import {generateAlias} from '../alias_generation'
import {TableAggregationSelection} from '../../parsing/selection/table_aggregation_selection_parsing'
import {generateTableAggregationOperation} from '../aggregation/table_aggregation_operation_generation'


export function generateTableAggregationSelection(aliasEscape: string|null, aggregation: TableAggregationSelection): string {
    const {parameterToTable, operations} = aggregation

    const columnOperations = operations
        .map(([alias, operation]) => {
            const generatedAggregationOperation = generateTableAggregationOperation(parameterToTable, operation)

            return generateAlias(aliasEscape, generatedAggregationOperation, alias)
        })

    return joinWithCommaWhitespace(columnOperations)
}