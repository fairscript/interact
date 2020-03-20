import {createGetFromParameter, GetFromParameter, Subselect} from '../../column_operations'
import {Selection} from '../selection_parsing'
import {mapParameterNamesToTableAliases} from '../../generation/table_aliases'
import {parseLambdaFunction} from '../lambda_parsing'
import {
    createRecordParser,
    createKeyValuePairParser, createNamedObjectPropertyParser
} from '../javascript/record_parsing'


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

    return createRecordParser(keyValuePair)
}

export function parseMap(f: Function): Selection {
    const { parameters, expression } = parseLambdaFunction(f)

    const parameterToTable = mapParameterNamesToTableAliases(parameters)
    const parser = createMapParser(parameters)

    const operations = parser.run(expression).result

    return createMapSelection(parameterToTable, operations)
}