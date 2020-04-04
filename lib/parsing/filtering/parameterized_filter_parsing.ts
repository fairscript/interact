import {extractLambdaParametersAndExpression} from '../javascript/lambda_parsing'
import {mapParameterNamesToTableAliases} from '../../generation/table_aliases'
import {ValueOrNestedValueRecord} from '../../record'
import {parseParameterizedPredicate, BooleanExpression} from '../booleanexpressions/boolean_expression_parsing'

export interface ParameterizedFilter {
    tableParameterToTableAlias: {[parameter: string]: string}
    predicate: BooleanExpression
    userProvided: ValueOrNestedValueRecord
    kind: 'parameterized-filter'
}

export function createParameterizedFilter(
    tableParameterToTableAlias: { [p: string]: string },
    predicate: BooleanExpression,
    userProvided: ValueOrNestedValueRecord): ParameterizedFilter {

    return {
        tableParameterToTableAlias,
        predicate,
        userProvided,
        kind: 'parameterized-filter'
    }
}

export function parseParameterizedFilter(f: Function, prefix: string, userProvided: ValueOrNestedValueRecord): ParameterizedFilter {
    const {parameters, expression} = extractLambdaParametersAndExpression(f)

    const userProvidedParameter = parameters[0]
    const tableParameters = parameters.slice(1)

    const tableParameterToTableAlias = mapParameterNamesToTableAliases(tableParameters)
    const predicate = parseParameterizedPredicate(prefix, userProvidedParameter, tableParameters, expression)

    return createParameterizedFilter(tableParameterToTableAlias, predicate, userProvided)
}