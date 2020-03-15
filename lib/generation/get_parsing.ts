import {createFindTableIndex} from '../parsing/table_index'
import {createObjectPropertyParser} from '../parsing/javascript_parsing'
import {createGet, Get} from '../column_operations'
import * as getParameterNames from 'get-parameter-names'
import {extractLambdaString} from '../lambda_string_extraction'

function createGetParser<T, U>(f: Function) {
    const parameterNames = getParameterNames(f)

    const objectProperty = createObjectPropertyParser(parameterNames)

    const findTableIndex = createFindTableIndex(parameterNames)

    return objectProperty
        .map(([object, property]) => createGet(findTableIndex(object), property))
}

export function parseGet(f: Function): Get {
    const parser = createGetParser(f)

    const lambdaString = extractLambdaString(f)

    const result = parser.run(lambdaString).result

    return result
}