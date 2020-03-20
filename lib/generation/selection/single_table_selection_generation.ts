import {joinWithCommaWhitespace} from '../../parsing/javascript_parsing'
import {SingleTableSelection} from '../../parsing/selection/single_table_selection_parsing'
import {generateColumnAccess} from '../column_access_generation'

export function generateSingleTableSelection(selection: SingleTableSelection): string {
    return joinWithCommaWhitespace(selection.properties.map(column => generateColumnAccess('t1', column)))
}

