import {parseGetColumn} from '../valuexpressions/get_column_parsing'
import {createSingleColumnSelection, SingleColumnSelection} from './single_column_selection_parsing'

export function parseGetSelection(f: Function): SingleColumnSelection {
    const [parameterNameToTableAlias, getColumn] = parseGetColumn(f)

    return createSingleColumnSelection(parameterNameToTableAlias, getColumn)
}