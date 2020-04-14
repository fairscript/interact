import {MapSelection} from '../../parsing/selection/map_selection_parsing'
import {generateGetColumn} from '../value_expressions/get_column_generation'
import {generateSubselectStatement} from '../subselect_generation'
import {generateAlias} from '../alias_generation'
import {SubselectStatement} from '../../statements/subselect_statement'
import {GetColumn} from '../../parsing/value_expressions/get_column_parsing'
import {joinWithCommaWhitespace} from '../../join'

function generateMapPropertyOperation(namedParameterPrefix: string, parameterToTable: { [parameter: string]: string }, operation: GetColumn | SubselectStatement): string {
    switch (operation.kind) {
        case 'get-column':
            return generateGetColumn(parameterToTable, operation)
        case 'subselect-statement':
            return generateSubselectStatement(namedParameterPrefix, operation.selection, operation.tableName, operation.filters)
    }
}

export function generateMapSelection(aliasEscape: string|null, namedParameterPrefix: string, selection: MapSelection): string {
    const {parameterNameToTableAlias, operations} = selection

    return joinWithCommaWhitespace(operations.map(([alias, operation]) =>
        generateAlias(aliasEscape, generateMapPropertyOperation(namedParameterPrefix, parameterNameToTableAlias, operation), alias)
    ))
}
