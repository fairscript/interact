import {extractLambdaString} from '../lambda_string_extraction'
import {createDictionaryParser, createKeyValuePairParser, createObjectPropertyParser} from './javascript_parsing'
import * as A from 'arcsecond'
import * as getParameterNames from 'get-parameter-names'
import {createAlias, createGet, ColumnOperation} from '../column_operations'

function createMapParser<T, U>(f: (table: T) => U) {
    const parameterNames = getParameterNames(f)

    const objectProperty = createObjectPropertyParser(parameterNames)

    const keyValuePair = createKeyValuePairParser(objectProperty)
        .map(([alias, [object, property]]) => createAlias(createGet(1, property), alias))

    const dictionaryParser = createDictionaryParser(keyValuePair)

    return A.choice([
        dictionaryParser,
        objectProperty
            .map(([object, property]) => createGet(1, property))
            .map(expr => [expr])]
    )
}

export function parseMap<T, U>(f: (table: T) => U): Array<ColumnOperation> {
    const parser = createMapParser(f)

    const lambdaString = extractLambdaString(f)

    const result = parser.run(lambdaString).result

    return result
}