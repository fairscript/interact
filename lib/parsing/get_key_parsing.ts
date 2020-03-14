import {extractLambdaString} from '../lambda_string_extraction'
import {createDictionaryParser, createKeyValuePairParser, createObjectPropertyParser} from './javascript_parsing'
import * as getParameterNames from 'get-parameter-names'
import {createGet, Get} from '../column_operations'
import {createFindTableIndex} from './table_index'

function createGetKeyParser<T, K>(f: Function) {
    const parameterNames = getParameterNames(f)

    let findTableIndex = createFindTableIndex(parameterNames)

    const objectProperty = createObjectPropertyParser(parameterNames)

    const keyValuePair = createKeyValuePairParser(objectProperty)
        .map(([alias, [object, property]]) => createGet(findTableIndex(object), property))

    return createDictionaryParser(keyValuePair)
}

export function parseGetKey<T, K>(f: Function): Get[] {
    const parser = createGetKeyParser(f)

    const lambdaString = extractLambdaString(f)

    const parsingResult = parser.run(lambdaString)

    return parsingResult.result
}

