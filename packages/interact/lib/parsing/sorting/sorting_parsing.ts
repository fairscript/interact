import {Direction} from '../../queries/one/sort_table'
import {extractLambdaParametersAndExpression} from '../functions/lambda_parsing'
import {mapParameterNamesToTableAliases} from '../../generation/table_aliases'
import {createGetColumnParser, GetColumn} from '../value_expressions/get_column_parsing'

export interface OrderExpression {
    parameterNameToTableAlias: {[parameterName: string]: string}
    get: GetColumn,
    direction: Direction
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

    const operation = createGetColumnParser(parameters).run(expression).result

    return createOrderExpression(
        parameterNameToTableAlias,
        operation,
        direction)
}