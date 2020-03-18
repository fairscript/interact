import {extractLambdaString} from '../lambda_string_extraction'
import {createDictionaryParser, createKeyValuePairParser, createNamedObjectPropertyParser} from './javascript_parsing'
import * as getParameterNames from 'get-parameter-names'
import {createGetFromParameter, GetFromParameter} from '../column_operations'
import {mapParameterNamesToTableAliases} from '../generation/table_aliases'

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

    return createDictionaryParser(keyValuePair)
}

export function parseGetKey(f: Function): Key {
    const parameterNames = getParameterNames(f)
    const parameterToTable = mapParameterNamesToTableAliases(parameterNames)

    const parser = createGetKeyParser(parameterNames)

    const lambdaString = extractLambdaString(f)

    const parts = parser.run(lambdaString).result

    const key = createKey(parameterToTable, parts)

    return key
}

