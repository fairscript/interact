import {extractLambdaParametersAndExpression} from '../functions/lambda_parsing'
import {mapParameterNamesToTableAliases} from '../../generation/table_aliases'
import {ValueOrNestedValueRecord} from '../../record'
import {parseParameterizedBooleanExpression, BooleanExpression} from '../boolean_expressions/boolean_expression_parsing'

export interface ParameterizedFilter {
    tableParameterToTableAlias: {[parameter: string]: string}
    booleanExpression: BooleanExpression
    userProvided: ValueOrNestedValueRecord
    kind: 'parameterized-filter'
}

export function createParameterizedFilter(
    tableParameterToTableAlias: { [p: string]: string },
    booleanExpression: BooleanExpression,
    userProvided: ValueOrNestedValueRecord): ParameterizedFilter {

    return {
        tableParameterToTableAlias,
        booleanExpression,
        userProvided,
        kind: 'parameterized-filter'
    }
}

export function parseParameterizedFilter(f: Function, prefix: string, userProvided: ValueOrNestedValueRecord): ParameterizedFilter {
    const {parameters, expression} = extractLambdaParametersAndExpression(f)

    const userProvidedParameter = parameters[0]
    const tableParameters = parameters.slice(1)

    const tableParameterToTableAlias = mapParameterNamesToTableAliases(tableParameters)
    const booleanExpression = parseParameterizedBooleanExpression(prefix, userProvidedParameter, tableParameters, expression)

    return createParameterizedFilter(tableParameterToTableAlias, booleanExpression, userProvided)
}