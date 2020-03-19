import {extractLambdaString} from '../../lambda_string_extraction'
import {createDictionaryParser, createKeyValuePairParser, createNamedObjectPropertyParser} from '../javascript_parsing'
import * as getParameterNames from 'get-parameter-names'
import {createGetFromParameter, GetFromParameter, Subselect} from '../../column_operations'
import {Selection} from '../selection_parsing'
import {mapParameterNamesToTableAliases} from '../../generation/table_aliases'

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

export function createGetFromParameterParser(parameterNames: string[]) {
    return createNamedObjectPropertyParser(parameterNames)
        .map(([object, property]) => createGetFromParameter(object, property))
}

function createMapParser(parameterNames: string[]) {
    const getFromParameterParser = createGetFromParameterParser(parameterNames)

    const keyValuePair = createKeyValuePairParser(getFromParameterParser)

    return createDictionaryParser(keyValuePair)
}

export function parseMap(f: Function): Selection {
    const parameterNames = getParameterNames(f)

    const parameterToTable = mapParameterNamesToTableAliases(parameterNames)
    const parser = createMapParser(parameterNames)

    const lambdaString = extractLambdaString(f)

    const operations = parser.run(lambdaString).result

    return createMapSelection(parameterToTable, operations)
}