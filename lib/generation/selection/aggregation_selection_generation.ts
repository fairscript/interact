import * as toSnakeCase from 'js-snakecase'

import {
    Aggregation,
    AggregationOperation
} from '../../parsing/selection/aggregation_parsing'
import {generateCount} from '../count_generation'
import {joinWithCommaWhitespace} from '../../parsing/javascript_parsing'

function generateGetPartOfKey(partOfKeyToTableAndProperty: { [part: string]: [string, string] }, part: string): string {
    const [table, property] = partOfKeyToTableAndProperty[part]
    const column = toSnakeCase(property)

    return `${table}.${column}`
}

function generateAggregate(parameterToTable: { [part: string]: string }, aggregationOperation: string, parameter: string, property: string): string {
    const table = parameterToTable[parameter]
    const column = toSnakeCase(property)

    return `${aggregationOperation.toUpperCase()}(${table}.${column})`
}

function createGenerateAggregationOperation(
    partOfKeyToTableAndProperty: { [part: string]: [string, string] },
    parameterToTable: { [parameter: string]: string }): (operation: AggregationOperation) => string {

    return (operation: AggregationOperation) => {
        switch (operation.kind) {
            case 'get-part-of-key':
                return generateGetPartOfKey(partOfKeyToTableAndProperty, operation.part)
            case 'aggregate-column':
                const {parameter, property} = operation.get
                return generateAggregate(parameterToTable, operation.aggregation, parameter, property)
            case 'count-rows-in-group':
                return generateCount()
        }
    }
}

export function generateAggregationSelection(aggregation: Aggregation): string {
    const {partOfKeyToTableAndProperty, parameterToTable, operations} = aggregation

    const generateAggregationOperation = createGenerateAggregationOperation(partOfKeyToTableAndProperty, parameterToTable)

    const columnOperations = operations.map(([alias, operation]) =>
        `${generateAggregationOperation(operation)} AS ${alias}`
    )

    return joinWithCommaWhitespace(columnOperations)
}