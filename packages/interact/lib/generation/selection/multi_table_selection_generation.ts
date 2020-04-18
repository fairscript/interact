import {MultiTableSelection} from '../../parsing/selection/multi_table_selection_parsing'
import {generateColumnAccess} from '../column_access_generation'
import {generateAlias} from '../alias_generation'
import {joinWithCommaWhitespace} from '../../join'
import {computeTableAlias} from '../table_aliases'
import {ColumnTypeRecord} from '../../record'

export function generateMultiTableSelection(aliasEscape: string|null, selection: MultiTableSelection, fromColumnRecord: ColumnTypeRecord, joinColumnRecords: ColumnTypeRecord[]): string {
    return joinWithCommaWhitespace(selection.names
        .map((name, index) => {

            const tableAlias = computeTableAlias('t', index)

            const columns = Object.keys(index === 0 ? fromColumnRecord : joinColumnRecords[index-1])
                .map(column => generateAlias(aliasEscape, generateColumnAccess(tableAlias, column), `${name}_${column}`) )

            return joinWithCommaWhitespace(columns)
        }))
}