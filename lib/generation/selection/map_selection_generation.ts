import {MapSelection} from '../../parsing/selection/map_selection_parsing'
import {generateGetColumn} from '../value_expressions/get_column_generation'
import {generateSubselectStatement} from '../subselect_generation'
import {joinWithCommaWhitespace} from '../../parsing/parsing_helpers'
import {generateAlias} from '../alias_generation'
import {SubselectStatement} from '../../select_statement'
import {GetColumn} from '../../parsing/value_expressions/get_column_parsing'

function generateMapPropertyOperation(namedParameterPrefix: string, parameterToTable: { [parameter: string]: string }, operation: GetColumn | SubselectStatement): string {
    switch (operation.kind) {
        case 'get-column':
            return generateGetColumn(parameterToTable, operation)
        case 'subselect-statement':
            return generateSubselectStatement(namedParameterPrefix, operation)
    }
}

export function generateMapSelection(aliasEscape: string|null, namedParameterPrefix: string, selection: MapSelection): string {
    const {parameterNameToTableAlias, operations} = selection

    return joinWithCommaWhitespace(operations.map(([alias, operation]) =>
        generateAlias(aliasEscape, generateMapPropertyOperation(namedParameterPrefix, parameterNameToTableAlias, operation), alias)
    ))
}
