import {Aggregation} from '../../parsing/selection/aggregation_parsing'
import {generateCount} from '../count_generation'
import {generateColumnAccess} from '../column_access_generation'
import {joinWithCommaWhitespace} from '../../parsing/parsing_helpers'
import {generateAlias} from '../alias_generation'
import {AggregationOperation} from '../../parsing/aggregation_operation_parsing'

export function generateGetPartOfKey(partOfKeyToTableAndProperty: { [part: string]: [string, string] }, part: string): string {
    const [tableAlias, property] = partOfKeyToTableAndProperty[part]

    return generateColumnAccess(tableAlias, property)
}

export function generateAggregateColumn(
    parameterNameToTableAlias: { [part: string]: string },
    aggregationFunction: string,
    object: string,
    property: string): string {

    const tableAlias = parameterNameToTableAlias[object]

    return `${aggregationFunction.toUpperCase()}(${generateColumnAccess(tableAlias, property)})`
}

export function generateAggregationOperation(
    partOfKeyToTableAndProperty: { [part: string]: [string, string] },
    parameterToTable: { [parameter: string]: string },
    operation: AggregationOperation): string {

    switch (operation.kind) {
        case 'get-part-of-key':
            return generateGetPartOfKey(partOfKeyToTableAndProperty, operation.part)
        case 'aggregate-column':
            const {object, property} = operation.get
            return generateAggregateColumn(parameterToTable, operation.aggregationFunction, object, property)
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