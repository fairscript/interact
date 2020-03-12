import {extractLambdaString} from '../lambda_string_extraction'
import {createDictionaryParser, createKeyValuePairParser, createObjectPropertyParser} from './javascript_parsing'
import * as getParameterNames from 'get-parameter-names'
import {createGet, Get} from './select_parsing'

function createGetKeyParser<T, U>(f: (x: T) => U) {
    const parameterNames = getParameterNames(f)

    const objectProperty = createObjectPropertyParser(parameterNames)

    const keyValuePair = createKeyValuePairParser(objectProperty)
        .map(([alias, [object, property]]) => createGet(object, property))

    return createDictionaryParser(keyValuePair)
}

export function parseGetKey<T, U>(f: (x: T) => U): Get[] {
    const parser = createGetKeyParser(f)

    const lambdaString = extractLambdaString(f)

    const parsingResult = parser.run(lambdaString)

    return parsingResult.result
}

