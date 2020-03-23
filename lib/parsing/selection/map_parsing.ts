import {createGetColumn, GetColumn, Subselect} from '../../column_operations'
import {Selection} from '../selection_parsing'
import {mapParameterNamesToTableAliases} from '../../generation/table_aliases'
import {extractLambdaParametersAndExpression} from '../javascript/lambda_parsing'
import {
    createRecordInParenthesesParser,
    createNamedObjectPropertyParser
} from '../javascript/record_parsing'


export interface MapSelection {
    kind: 'map-selection'
    parameterToTable: {[parameter: string]: string}
    operations: [string, GetColumn|Subselect][]
}

export function createMapSelection(
    parameterToTable: {[parameter: string]: string},
    operations: [string, GetColumn|Subselect][]): MapSelection {

    return {
        kind: 'map-selection',
        parameterToTable,
        operations
    }
}

export function createGetFromParameterParser(parameterNames: string[]) {
    return createNamedObjectPropertyParser(parameterNames)
        .map(([object, property]) => createGetColumn(object, property))
}

function createMapParser(parameterNames: string[]) {
    const getFromParameterParser = createGetFromParameterParser(parameterNames)

    return createRecordInParenthesesParser(getFromParameterParser)
}

export function parseMap(f: Function): Selection {
    const { parameters, expression } = extractLambdaParametersAndExpression(f)

    const parameterToTable = mapParameterNamesToTableAliases(parameters)
    const parser = createMapParser(parameters)

    const operations = parser.run(expression).result

    return createMapSelection(parameterToTable, operations)
}