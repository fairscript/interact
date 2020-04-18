import {SingleTableSelection} from '../../parsing/selection/single_table_selection_parsing'
import {generateColumnAccess} from '../column_access_generation'
import {generateAlias} from '../alias_generation'
import {joinWithCommaWhitespace} from '../../join'
import {ColumnTypeRecord} from '../../record'

export function generateSingleTableSelection(
    aliasEscape: string|null,
    selection: SingleTableSelection,
    columns: ColumnTypeRecord): string {
    return joinWithCommaWhitespace(
        Object.keys(columns).map(column =>
            generateAlias(aliasEscape, generateColumnAccess('t1', column), column)
        )
    )
}

