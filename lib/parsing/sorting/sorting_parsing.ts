import {Direction} from '../../queries/one/sort_table'
import {extractLambdaParametersAndExpression} from '../javascript/lambda_parsing'
import {createNamedObjectPropertyParser} from '../javascript/record_parsing'
import {createGetColumn, GetColumn} from '../../column_operations'
import {mapParameterNamesToTableAliases} from '../../generation/table_aliases'

export interface OrderExpression {
    parameterNameToTableAlias: {[parameterName: string]: string}
    get: GetColumn,
    direction: 'asc'|'desc'
    kind: 'order-expression'
}

export function createOrderExpression(
    parameterNameToTableAlias: {[parameterName: string]: string},
    get: GetColumn,
    direction: 'asc'|'desc'): OrderExpression {

    return {
        parameterNameToTableAlias: parameterNameToTableAlias,
        get,
        direction,
        kind: 'order-expression'
    }
}

export function parseSorting(f: Function, direction: Direction): OrderExpression {
    const { parameters, expression } = extractLambdaParametersAndExpression(f)

    const parameterNameToTableAlias = mapParameterNamesToTableAliases(parameters)

    const parser = createNamedObjectPropertyParser(parameters)
        .map(([object, property]) => createGetColumn(object, property))

    const operation = parser.run(expression).result

    return createOrderExpression(
        parameterNameToTableAlias,
        operation,
        direction)
}