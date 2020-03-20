import {createGetFromParameter, GetFromParameter} from '../column_operations'
import {mapParameterNamesToTableAliases} from '../generation/table_aliases'
import {parseLambdaFunction} from './lambda_parsing'
import {
    createRecordParser,
    createKeyValuePairParser, createNamedObjectPropertyParser
} from './javascript/record_parsing'

export interface PartOfKey {
    alias: string
    get: GetFromParameter
}

export function createPartOfKey(alias: string, get: GetFromParameter): PartOfKey {
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

    const keyValuePair = createKeyValuePairParser(objectProperty)
        .map(([alias, [object, property]]) => createPartOfKey(alias, createGetFromParameter(object, property)))

    return createRecordParser(keyValuePair)
}

export function parseGetKey(f: Function): Key {
    const { parameters, expression } = parseLambdaFunction(f)

    const parameterToTable = mapParameterNamesToTableAliases(parameters)

    const parser = createGetKeyParser(parameters)

    const parts = parser.run(expression).result

    const key = createKey(parameterToTable, parts)

    return key
}

