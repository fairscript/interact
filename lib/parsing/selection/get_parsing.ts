import {createNamedObjectPropertyParser} from '../javascript_parsing'
import {createGetFromParameter, GetFromParameter} from '../../column_operations'
import * as getParameterNames from 'get-parameter-names'
import {extractLambdaString} from '../../lambda_string_extraction'
import {Selection} from '../selection_parsing'

function createGetParser<T, U>(parameterNames: string[]) {
    const objectProperty = createNamedObjectPropertyParser(parameterNames)

    return objectProperty
        .map(([object, property]) => createGetFromParameter(object, property))
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
    const parameterNames = getParameterNames(f)

    const parser = createGetParser(parameterNames)

    const lambdaString = extractLambdaString(f)

    const getFromParameter = parser.run(lambdaString).result

    const table = `t${parameterNames.indexOf(getFromParameter.parameter)+1}`

    return createGetSelection(table, getFromParameter.property)
}