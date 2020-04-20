import {generateAlias} from '../alias_generation'
import {TableAggregationSelection} from '../../parsing/selection/table_aggregation_selection_parsing'
import {generateTableAggregationOperation} from '../aggregation/table_aggregation_operation_generation'
import {joinWithCommaWhitespace} from '../../join'


export function generateTableAggregationSelection(
    aliasEscape: string|null,
    generateConvertToInt: (getColumn: string) => string,
    generateConvertToFloat: (getColumn: string) => string,
    aggregation: TableAggregationSelection): string {

    const {parameterToTable, operations} = aggregation

    const columnOperations = operations
        .map(([alias, operation]) => {
            const generatedAggregationOperation = generateTableAggregationOperation(generateConvertToInt, generateConvertToFloat, parameterToTable, operation)

            return generateAlias(aliasEscape, generatedAggregationOperation, alias)
        })

    return joinWithCommaWhitespace(columnOperations)
}