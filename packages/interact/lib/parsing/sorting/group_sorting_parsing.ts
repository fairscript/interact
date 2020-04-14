import {Direction} from '../../queries/one/sort_table'
import {extractLambdaParametersAndExpression} from '../functions/lambda_parsing'
import {mapParameterNamesToTableAliases} from '../../generation/table_aliases'
import {GroupAggregationOperation, createGroupAggregationOperationParser} from '../aggregation/group_aggregation_operation_parsing'
import {Key} from '../get_key_parsing'

export interface GroupOrderExpression {
    parameterNameToTableAlias: {[parameterName: string]: string}
    operation: GroupAggregationOperation,
    direction: Direction
}

export function createGroupOrderExpression(
    parameterNameToTableAlias: {[parameterName: string]: string},
    operation: GroupAggregationOperation,
    direction: Direction): GroupOrderExpression {

    return {
        parameterNameToTableAlias,
        operation,
        direction
    }
}

export function parseGroupSorting(f: Function, direction: Direction, key: Key, numberOfTables: number): GroupOrderExpression {
    const { parameters, expression } = extractLambdaParametersAndExpression(f)

    const keyParameterName = parameters[0]
    const objectParameterNames = parameters.slice(1, numberOfTables+1)
    const countParameter = parameters.length > 1 + numberOfTables ? parameters[parameters.length - 1] : null

    const parameterNameToTableAlias = mapParameterNamesToTableAliases(objectParameterNames)

    const parser = createGroupAggregationOperationParser(keyParameterName, objectParameterNames, countParameter)

    const operation = parser.run(expression).result

    return createGroupOrderExpression(parameterNameToTableAlias, operation, direction)

}