import {Selection} from './selection_parsing'
import {mapParameterNamesToTableAliases} from '../../generation/table_aliases'
import {extractLambdaParametersAndExpression} from '../javascript/lambda_parsing'
import {createRecordInParenthesesParser} from '../javascript/record_parsing'
import {findReferencedColumns} from './search_for_referenced_columns'
import {SubselectStatement} from '../../select_statement'
import {createGetColumnParser, GetColumn} from '../get_column_parsing'


export interface MapSelection {
    kind: 'map-selection'
    parameterNameToTableAlias: {[parameter: string]: string}
    operations: [string, GetColumn|SubselectStatement][]
    referencedColumns: GetColumn[]
}

export function createMapSelection(
    parameterToTable: {[parameter: string]: string},
    operations: [string, GetColumn|SubselectStatement][]): MapSelection {

    const referencedColumns = operations.reduce(
        (acc, [_, op]) => acc.concat(findReferencedColumns(op)),
        [] as GetColumn[])

    return {
        kind: 'map-selection',
        parameterNameToTableAlias: parameterToTable,
        operations,
        referencedColumns
    }
}

function createMapParser(parameterNames: string[]) {
    return createRecordInParenthesesParser(createGetColumnParser(parameterNames))
}

export function parseMapSelection(f: Function): Selection {
    const { parameters, expression } = extractLambdaParametersAndExpression(f)

    const parameterToTable = mapParameterNamesToTableAliases(parameters)
    const parser = createMapParser(parameters)

    const operations = parser.run(expression).result

    return createMapSelection(parameterToTable, operations)
}