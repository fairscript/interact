import {Key} from '../get_key_parsing'
import {extractLambdaParametersAndExpression} from '../functions/lambda_parsing'
import {createRecordInParenthesesParser} from '../literals/record_parsing'
import {mapParameterNamesToTableAliases} from '../../generation/table_aliases'
import {GroupAggregationOperation, createGroupAggregationOperationParser} from '../aggregation/group_aggregation_operation_parsing'


export interface GroupAggregationSelection {
    kind: 'group-aggregation-selection',
    parameterToTable: {[partOfKey: string]: string},
    operations: [string, GroupAggregationOperation][]
}

export function createGroupAggregation(
    parameterToTable: {[partOfKey: string]: string},
    operations: [string, GroupAggregationOperation][]): GroupAggregationSelection {

    return {
        kind: 'group-aggregation-selection',
        parameterToTable,
        operations
    }
}

export function parseGroupAggregationSelection(f: Function, key: Key, numberOfTables: number): GroupAggregationSelection {
    const { parameters, expression } = extractLambdaParametersAndExpression(f)

    const keyParameterName = parameters[0]
    const objectParameterNames = parameters.slice(1, numberOfTables+1)
    const countParameter = parameters.length > 1 + numberOfTables ? parameters[parameters.length - 1]: null

    const parameterToTable = mapParameterNamesToTableAliases(objectParameterNames)

    const valueParser = createGroupAggregationOperationParser(keyParameterName, objectParameterNames, countParameter)
    const parser = createRecordInParenthesesParser(valueParser)

    const operations = parser.run(expression).result

    const aggregation = createGroupAggregation(parameterToTable, operations)

    return aggregation
}