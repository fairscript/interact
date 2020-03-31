import {GroupAggregationSelection} from '../../parsing/selection/group_aggregation_selection_parsing'
import {joinWithCommaWhitespace} from '../../parsing/parsing_helpers'
import {generateAlias} from '../alias_generation'
import {generateGroupAggregationOperation} from '../aggregation/group_aggregation_operation_generation'

export function generateGroupAggregationSelection(aliasEscape: string|null, aggregation: GroupAggregationSelection): string {
    const {partOfKeyToTableAndProperty, parameterToTable, operations} = aggregation

    const columnOperations = operations
        .map(([alias, operation]) => {
            const generatedAggregationOperation = generateGroupAggregationOperation(partOfKeyToTableAndProperty, parameterToTable, operation)

            return generateAlias(aliasEscape, generatedAggregationOperation, alias)
        })

    return joinWithCommaWhitespace(columnOperations)
}