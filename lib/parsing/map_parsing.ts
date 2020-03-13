import {extractLambdaString} from '../lambda_string_extraction'
import {createDictionaryParser, createKeyValuePairParser, createObjectPropertyParser} from './javascript_parsing'
import * as A from 'arcsecond'
import * as getParameterNames from 'get-parameter-names'
import {createAlias, createGet, ColumnOperation} from '../column_operations'
import {createFindTableIndex} from './table_index'

function createMapParser<T, U>(f: Function) {
    const parameterNames = getParameterNames(f)

    const findTableIndex = createFindTableIndex(parameterNames)

    const objectProperty = createObjectPropertyParser(parameterNames)

    const keyValuePair = createKeyValuePairParser(objectProperty)
        .map(([alias, [object, property]]) => createAlias(createGet(findTableIndex(object), property), alias))

    const dictionaryParser = createDictionaryParser(keyValuePair)

    return A.choice([
        dictionaryParser,
        objectProperty
            .map(([object, property]) => createGet(findTableIndex(object), property))
            .map(expr => [expr])]
    )
}

export function parseMap(f: Function): Array<ColumnOperation> {
    const parser = createMapParser(f)

    const lambdaString = extractLambdaString(f)

    const result = parser.run(lambdaString).result

    return result
}