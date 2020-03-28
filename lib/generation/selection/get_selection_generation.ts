import {GetSelection} from '../../parsing/selection/get_parsing'
import {generateGetColumn} from '../get_column_generation'

export function generateGetSelection(selection: GetSelection): string {
    return generateGetColumn(selection.parameterNameToTableAlias, selection.get)
}