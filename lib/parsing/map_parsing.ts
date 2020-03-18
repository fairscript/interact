import {extractLambdaString} from '../lambda_string_extraction'
import {createDictionaryParser, createKeyValuePairParser, createNamedObjectPropertyParser} from './javascript_parsing'
import * as getParameterNames from 'get-parameter-names'
import {createGetFromParameter, GetFromParameter, Subselect} from '../column_operations'
import {Selection} from './select_parsing'
import {mapParameterNamesToTableAliases} from '../generation/table_aliases'

export interface MapSelection {
    kind: 'map-selection'
    parameterToTable: {[parameter: string]: string}
    operations: [string, GetFromParameter|Subselect][]
}

export function createMapSelection(
    parameterToTable: {[parameter: string]: string},
    operations: [string, GetFromParameter|Subselect][]): MapSelection {

    return {
        kind: 'map-selection',
        parameterToTable,
        operations
    }
}

function createMapParser(parameterNames: string[]) {
    const objectProperty = createNamedObjectPropertyParser(parameterNames)

    const keyValuePair = createKeyValuePairParser(objectProperty)
        .map(([alias, [object, property]]) => [alias, createGetFromParameter(object, property)])

    const dictionaryParser = createDictionaryParser(keyValuePair)

    return dictionaryParser
}

export function parseMap(f: Function): Selection {
    const parameterNames = getParameterNames(f)

    const parameterToTable = mapParameterNamesToTableAliases(parameterNames)
    const parser = createMapParser(parameterNames)

    const lambdaString = extractLambdaString(f)

    const operations = parser.run(lambdaString).result

    return createMapSelection(parameterToTable, operations)
}