import {Aggregation} from '../../parsing/selection/aggregation_selection_parsing'
import {generateCount} from '../count_generation'
import {generateColumnAccess} from '../column_access_generation'
import {joinWithCommaWhitespace} from '../../parsing/parsing_helpers'
import {generateAlias} from '../alias_generation'
import {AggregationOperation} from '../../parsing/aggregation_operation_parsing'
import {AggregateColumn} from '../../parsing/aggregation/aggregate_column_parsing'
import {generateGetColumn} from '../get_column_generation'

export function generateGetPartOfKey(partOfKeyToTableAndProperty: { [part: string]: [string, string] }, part: string): string {
    const [tableAlias, property] = partOfKeyToTableAndProperty[part]

    return generateColumnAccess(tableAlias, property)
}

export function generateAggregateColumn(
    parameterNameToTableAlias: { [part: string]: string },
    aggregateColumn: AggregateColumn): string {

    return `${aggregateColumn.aggregationFunction.toUpperCase()}(${generateGetColumn(parameterNameToTableAlias, aggregateColumn.get)})`
}

export function generateAggregationOperation(
    partOfKeyToTableAndProperty: { [part: string]: [string, string] },
    parameterToTable: { [parameter: string]: string },
    operation: AggregationOperation): string {

    switch (operation.kind) {
        case 'get-part-of-key':
            return generateGetPartOfKey(partOfKeyToTableAndProperty, operation.part)
        case 'aggregate-column':
            return generateAggregateColumn(parameterToTable, operation)
        case 'count-rows-in-group':
            return generateCount()
    }
}

export function generateAggregationSelection(aliasEscape: string|null, aggregation: Aggregation): string {
    const {partOfKeyToTableAndProperty, parameterToTable, operations} = aggregation

    const columnOperations = operations
        .map(([alias, operation]) => {
            const generatedAggregationOperation = generateAggregationOperation(partOfKeyToTableAndProperty, parameterToTable, operation)

            return generateAlias(aliasEscape, generatedAggregationOperation, alias)
        })

    return joinWithCommaWhitespace(columnOperations)
}