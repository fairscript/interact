import {createGetColumn, GetColumn} from '../../column_operations'
import {Selection} from '../selection_parsing'
import {extractLambdaParametersAndExpression} from '../javascript/lambda_parsing'
import {createNamedObjectPropertyParser} from '../javascript/record_parsing'
import {mapParameterNamesToTableAliases} from '../../generation/table_aliases'

function createGetParser<T, U>(parameterNames: string[]) {
    const objectProperty = createNamedObjectPropertyParser(parameterNames)

    return objectProperty
        .map(([object, property]) => createGetColumn(object, property))
}

export interface GetSelection {
    kind: 'get-selection'
    parameterNameToTableAlias: {[parameter: string]: string},
    get: GetColumn
}

export function createGetSelection(parameterNameToTableAlias: {[parameter: string]: string}, get: GetColumn): GetSelection {
    return {
        kind: 'get-selection',
        parameterNameToTableAlias,
        get
    }
}

export function parseGet(f: Function): Selection {
    const { parameters, expression } = extractLambdaParametersAndExpression(f)

    const parameterNameToTableAlias = mapParameterNamesToTableAliases(parameters)

    const getColumn = createGetParser(parameters).run(expression).result

    return createGetSelection(parameterNameToTableAlias, getColumn)
}