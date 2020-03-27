import {MapSelection} from '../../parsing/selection/map_parsing'
import {GetColumn, Subselect} from '../../column_operations'
import {generateGetColumn} from '../get_column_generation'
import {generateSubselect} from '../subselect_generation'
import {joinWithCommaWhitespace} from '../../parsing/parsing_helpers'
import {generateAlias} from '../alias_generation'

function generateMapPropertyOperation(namedParameterPrefix: string, parameterToTable: { [parameter: string]: string }, operation: GetColumn | Subselect): string {
    switch (operation.kind) {
        case 'get-column':
            return generateGetColumn(parameterToTable, operation)
        case 'subselect':
            return generateSubselect(namedParameterPrefix, operation)
    }
}

export function generateMapSelection(aliasEscape: string, namedParameterPrefix: string, selection: MapSelection): string {
    const {parameterToTable, operations} = selection

    return joinWithCommaWhitespace(operations.map(([alias, operation]) =>
        generateAlias(aliasEscape, generateMapPropertyOperation(namedParameterPrefix, parameterToTable, operation), alias)
    ))
}
