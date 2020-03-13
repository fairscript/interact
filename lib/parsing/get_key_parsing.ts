import {extractLambdaString} from '../lambda_string_extraction'
import {createDictionaryParser, createKeyValuePairParser, createObjectPropertyParser} from './javascript_parsing'
import * as getParameterNames from 'get-parameter-names'
import {createGet, Get} from '../column_operations'

function createGetKeyParser<T, K>(f: (table: T) => K) {
    const parameterNames = getParameterNames(f)

    const objectProperty = createObjectPropertyParser(parameterNames)

    const keyValuePair = createKeyValuePairParser(objectProperty)
        .map(([alias, [object, property]]) => createGet(1, property))

    return createDictionaryParser(keyValuePair)
}

export function parseGetKey<T, K>(f: (table: T) => K): Get[] {
    const parser = createGetKeyParser(f)

    const lambdaString = extractLambdaString(f)

    const parsingResult = parser.run(lambdaString)

    return parsingResult.result
}

