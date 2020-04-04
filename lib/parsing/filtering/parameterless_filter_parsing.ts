import {extractLambdaParametersAndExpression} from '../javascript/lambda_parsing'
import {mapParameterNamesToTableAliases} from '../../generation/table_aliases'
import {parseParameterlessPredicate, BooleanExpression} from '../boolean_expressions/boolean_expression_parsing'

export interface ParameterlessFilter {
    tableParameterToTableAlias: {[parameter: string]: string}
    predicate: BooleanExpression
    kind: 'parameterless-filter'
}

export function createParameterlessFilter(
    tableParameterToTableAlias: { [p: string]: string },
    predicate: BooleanExpression): ParameterlessFilter {
    return {
        tableParameterToTableAlias,
        predicate,
        kind: 'parameterless-filter'
    }
}

export function parseParameterlessFilter(f: Function): ParameterlessFilter {
    const { parameters, expression } = extractLambdaParametersAndExpression(f)

    const tableParameterToTableAlias = mapParameterNamesToTableAliases(parameters)
    const predicate = parseParameterlessPredicate(parameters, expression)

    return createParameterlessFilter(tableParameterToTableAlias, predicate)
}