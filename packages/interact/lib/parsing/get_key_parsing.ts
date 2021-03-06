import {mapParameterNamesToTableAliases} from '../generation/table_aliases'
import {extractLambdaParametersAndExpression} from './functions/lambda_parsing'
import {
    createRecordInParenthesesParser,
    createNamedObjectPropertyParser
} from './literals/record_parsing'
import {createGetColumn, GetColumn} from './value_expressions/get_column_parsing'

export interface PartOfKey {
    alias: string
    get: GetColumn
}

export function createPartOfKey(alias: string, get: GetColumn): PartOfKey {
    return {
        alias,
        get
    }
}

export interface Key {
    parameterToTable: {[parameter: string]: string}
    partsOfKey: PartOfKey[]
}

export function createKey(parameterToTable: {[parameter: string]: string}, partsOfKey: PartOfKey[]): Key {
    return {
        parameterToTable,
        partsOfKey
    }
}

function createGetKeyParser(parameterNames: string[]) {
    const objectProperty = createNamedObjectPropertyParser(parameterNames)

    return createRecordInParenthesesParser(objectProperty)
        .map(keyValuePairs =>
            keyValuePairs.map(([alias, [object, property]]) => createPartOfKey(alias, createGetColumn(object, property)))
        )
}

export function parseGetKey(f: Function): Key {
    const { parameters, expression } = extractLambdaParametersAndExpression(f)

    const parameterToTable = mapParameterNamesToTableAliases(parameters)

    const parser = createGetKeyParser(parameters)

    const parts = parser.run(expression).result

    const key = createKey(parameterToTable, parts)

    return key
}

