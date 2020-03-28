import {Direction} from '../queries/one/sort_table'
import {extractLambdaParametersAndExpression} from './javascript/lambda_parsing'
import {createNamedObjectPropertyParser} from './javascript/record_parsing'
import {createGetColumn, GetColumn} from '../column_operations'
import {mapParameterNamesToTableAliases} from '../generation/table_aliases'
import {AggregateColumn} from './selection/aggregation_parsing'

export interface OrderExpression {
    parameterNameToTableAlias: {[parameterName: string]: string}
    operation: GetColumn|AggregateColumn,
    direction: 'asc'|'desc'
}

export function createOrderExpression(
    parameterNameToTableAlias: {[parameterName: string]: string},
    operation: GetColumn|AggregateColumn,
    direction: 'asc'|'desc'): OrderExpression {

    return {
        parameterNameToTableAlias: parameterNameToTableAlias,
        operation,
        direction
    }
}

export function parseOrder(f: Function, direction: Direction): OrderExpression {
    const { parameters, expression } = extractLambdaParametersAndExpression(f)

    const parameterNameToTableAlias = mapParameterNamesToTableAliases(parameters)

    const parser = createNamedObjectPropertyParser(parameters)
        .map(([object, property]) => {
            return createGetColumn(object, property)
        })

    const operation = parser.run(expression).result

    return createOrderExpression(
        parameterNameToTableAlias,
        operation,
        direction)
}