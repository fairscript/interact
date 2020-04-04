import {extractLambdaParametersAndExpression} from '../javascript/lambda_parsing'
import {mapParameterNamesToTableAliases} from '../../generation/table_aliases'
import {parseParameterlessBooleanExpression, BooleanExpression} from '../boolean_expressions/boolean_expression_parsing'

export interface ParameterlessFilter {
    tableParameterToTableAlias: {[parameter: string]: string}
    booleanExpression: BooleanExpression
    kind: 'parameterless-filter'
}

export function createParameterlessFilter(
    tableParameterToTableAlias: { [p: string]: string },
    booleanExpression: BooleanExpression): ParameterlessFilter {
    return {
        tableParameterToTableAlias,
        booleanExpression,
        kind: 'parameterless-filter'
    }
}

export function parseParameterlessFilter(f: Function): ParameterlessFilter {
    const { parameters, expression } = extractLambdaParametersAndExpression(f)

    const tableParameterToTableAlias = mapParameterNamesToTableAliases(parameters)
    const booleanExpression = parseParameterlessBooleanExpression(parameters, expression)

    return createParameterlessFilter(tableParameterToTableAlias, booleanExpression)
}