import {extractLambdaParametersAndExpression} from '../javascript/lambda_parsing'
import {mapParameterNamesToTableAliases} from '../../generation/table_aliases'
import {
    createTableAggregationOperationParser,
    TableAggregationOperation
} from '../aggregation/table_aggregation_operation_parsing'
import {createRecordInParenthesesParser} from '../javascript/record_parsing'


export interface TableAggregationSelection {
    kind: 'table-aggregation-selection',
    parameterToTable: {[partOfKey: string]: string},
    operations: [string, TableAggregationOperation][]
}

export function createTableAggregationSelection(
    parameterToTable: {[partOfKey: string]: string},
    operations: [string, TableAggregationOperation][]): TableAggregationSelection {

    return {
        kind: 'table-aggregation-selection',
        parameterToTable,
        operations
    }
}

export function parseTableAggregationSelection(f: Function, numberOfTables: number): TableAggregationSelection {
    const { parameters, expression } = extractLambdaParametersAndExpression(f)

    const objectParameterNames = parameters.slice(0, numberOfTables+1)
    const countParameter = parameters.length > numberOfTables ? parameters[parameters.length - 1]: null

    const parameterToTable = mapParameterNamesToTableAliases(objectParameterNames)

    const valueParser = createTableAggregationOperationParser(objectParameterNames, countParameter)
    const parser = createRecordInParenthesesParser(valueParser)

    const operations = parser.run(expression).result

    const aggregation = createTableAggregationSelection(parameterToTable, operations)

    return aggregation
}