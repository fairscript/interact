import {createGetColumn} from '../../column_operations'
import {Selection} from '../selection_parsing'
import {extractLambdaParametersAndExpression} from '../javascript/lambda_parsing'
import {createNamedObjectPropertyParser} from '../javascript/record_parsing'

function createGetParser<T, U>(parameterNames: string[]) {
    const objectProperty = createNamedObjectPropertyParser(parameterNames)

    return objectProperty
        .map(([object, property]) => createGetColumn(object, property))
}

export interface GetSelection {
    kind: 'get-selection'
    table: string
    property: string
}

export function createGetSelection(table: string, property: string): GetSelection {
    return {
        kind: 'get-selection',
        table,
        property
    }
}

export function parseGet(f: Function): Selection {
    const { parameters, expression } = extractLambdaParametersAndExpression(f)

    const parser = createGetParser(parameters)

    const getFromParameter = parser.run(expression).result

    const table = `t${parameters.indexOf(getFromParameter.object)+1}`

    return createGetSelection(table, getFromParameter.property)
}