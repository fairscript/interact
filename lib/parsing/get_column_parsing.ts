import {createNamedObjectPropertyParser} from './javascript/record_parsing'
import {createGetColumn, GetColumn} from '../column_operations'
import {Selection} from './selection/selection_parsing'
import {extractLambdaParametersAndExpression} from './javascript/lambda_parsing'
import {mapParameterNamesToTableAliases} from '../generation/table_aliases'

export function createGetColumnParser(parameterNames: string[]) {
    return createNamedObjectPropertyParser(parameterNames)
        .map(([object, property]) => createGetColumn(object, property))
}

export function parseGetColumn(f: Function): [{[parameter: string]: string}, GetColumn] {
    const { parameters, expression } = extractLambdaParametersAndExpression(f)

    const parameterNameToTableAlias = mapParameterNamesToTableAliases(parameters)

    const getColumn = createGetColumnParser(parameters).run(expression).result

    return [parameterNameToTableAlias, getColumn]
}