import {GroupAggregationSelection} from '../../parsing/selection/group_aggregation_selection_parsing'
import {generateAlias} from '../alias_generation'
import {generateGroupAggregationOperation} from '../aggregation/group_aggregation_operation_generation'
import {joinWithCommaWhitespace} from '../../join'
import {Key} from '../../parsing/get_key_parsing'

export function generateGroupAggregationSelection(
    aliasEscape: string|null,
    namedParameterPrefix: string,
    generateConvertToInt: (getColumn: string) => string,
    aggregation: GroupAggregationSelection,
    key: Key): string {

    const {parameterToTable, operations} = aggregation

    const columnOperations = operations
        .map(([alias, operation]) => {
            const generatedAggregationOperation = generateGroupAggregationOperation(namedParameterPrefix, generateConvertToInt, key, parameterToTable, operation)

            return generateAlias(aliasEscape, generatedAggregationOperation, alias)
        })

    return joinWithCommaWhitespace(columnOperations)
}