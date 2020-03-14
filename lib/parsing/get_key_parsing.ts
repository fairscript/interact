import {extractLambdaString} from '../lambda_string_extraction'
import {createDictionaryParser, createKeyValuePairParser, createObjectPropertyParser} from './javascript_parsing'
import * as getParameterNames from 'get-parameter-names'
import {createAlias, createGet, Get} from '../column_operations'
import {createFindTableIndex} from './table_index'

export interface PartOfKey {
    get: Get
    alias: string
    kind: 'part-of-key'
}

export function createPartOfKey(get: Get, alias: string): PartOfKey {
    return {
        get,
        alias,
        kind: 'part-of-key'
    }
}

function createGetKeyParser(f: Function) {
    const parameterNames = getParameterNames(f)

    let findTableIndex = createFindTableIndex(parameterNames)

    const objectProperty = createObjectPropertyParser(parameterNames)

    const keyValuePair = createKeyValuePairParser(objectProperty)
        .map(([alias, [object, property]]) => createPartOfKey(createGet(findTableIndex(object), property), alias))

    return createDictionaryParser(keyValuePair)
}

export function parseGetKey(f: Function): PartOfKey[] {
    const parser = createGetKeyParser(f)

    const lambdaString = extractLambdaString(f)

    const parsingResult = parser.run(lambdaString)

    return parsingResult.result
}

