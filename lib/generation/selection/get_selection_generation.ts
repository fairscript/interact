import {GetSelection} from '../../parsing/selection/get_parsing'
import {generateColumnAccess} from '../column_access_generation'

export function generateGetSelection(selection: GetSelection): string {
    return generateColumnAccess(selection.table, selection.property)
}