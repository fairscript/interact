import {
    Aggregation,
    AggregationOperation
} from '../../parsing/selection/aggregation_parsing'
import {generateCount} from '../count_generation'
import {generateColumnAccess} from '../column_access_generation'
import {joinWithCommaWhitespace} from '../../parsing/parsing_helpers'
import {generateAlias} from '../alias_generation'

function generateGetPartOfKey(partOfKeyToTableAndProperty: { [part: string]: [string, string] }, part: string): string {
    const [tableAlias, property] = partOfKeyToTableAndProperty[part]

    return generateColumnAccess(tableAlias, property)
}

function generateAggregate(
    parameterToTable: { [part: string]: string },
    aggregationOperation: string,
    parameter: string,
    property: string): string {

    const tableAlias = parameterToTable[parameter]

    return `${aggregationOperation.toUpperCase()}(${generateColumnAccess(tableAlias, property)})`
}

function createGenerateAggregationOperation(
    partOfKeyToTableAndProperty: { [part: string]: [string, string] },
    parameterToTable: { [parameter: string]: string }): (operation: AggregationOperation) => string {

    return (operation: AggregationOperation) => {
        switch (operation.kind) {
            case 'get-part-of-key':
                return generateGetPartOfKey(partOfKeyToTableAndProperty, operation.part)
            case 'aggregate-column':
                const {object, property} = operation.get
                return generateAggregate(parameterToTable, operation.aggregation, object, property)
            case 'count-rows-in-group':
                return generateCount()
        }
    }
}

export function generateAggregationSelection(aliasEscape: string, aggregation: Aggregation): string {
    const {partOfKeyToTableAndProperty, parameterToTable, operations} = aggregation

    const generateAggregationOperation = createGenerateAggregationOperation(partOfKeyToTableAndProperty, parameterToTable)

    const columnOperations = operations.map(([alias, operation]) =>
        generateAlias(aliasEscape, generateAggregationOperation(operation), alias)
    )

    return joinWithCommaWhitespace(columnOperations)
}