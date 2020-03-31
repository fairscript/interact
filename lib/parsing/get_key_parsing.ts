import {createGetColumn, GetColumn} from '../column_operations'
import {mapParameterNamesToTableAliases} from '../generation/table_aliases'
import {extractLambdaParametersAndExpression} from './javascript/lambda_parsing'
import {
    createRecordInParenthesesParser,
    createNamedObjectPropertyParser
} from './javascript/record_parsing'

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
    parts: PartOfKey[]
}

export function createKey(parameterToTable: {[parameter: string]: string}, parts: PartOfKey[]): Key {
    return {
        parameterToTable,
        parts
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

