import {GroupAggregationSelection} from '../../parsing/selection/group_aggregation_selection_parsing'
import {generateAlias} from '../alias_generation'
import {generateGroupAggregationOperation} from '../aggregation/group_aggregation_operation_generation'
import {joinWithCommaWhitespace} from '../../join'

export function generateGroupAggregationSelection(aliasEscape: string|null, aggregation: GroupAggregationSelection): string {
    const {partOfKeyToTableAndProperty, parameterToTable, operations} = aggregation

    const columnOperations = operations
        .map(([alias, operation]) => {
            const generatedAggregationOperation = generateGroupAggregationOperation(partOfKeyToTableAndProperty, parameterToTable, operation)

            return generateAlias(aliasEscape, generatedAggregationOperation, alias)
        })

    return joinWithCommaWhitespace(columnOperations)
}