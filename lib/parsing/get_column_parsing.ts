import {createNamedObjectPropertyParser} from './javascript/record_parsing'
import {extractLambdaParametersAndExpression} from './javascript/lambda_parsing'
import {mapParameterNamesToTableAliases} from '../generation/table_aliases'

export interface GetColumn {
    kind: 'get-column'
    object: string,
    property: string,
}

export function createGetColumn(object: string, property: string): GetColumn {
    return {
        kind: 'get-column',
        object,
        property
    }
}

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