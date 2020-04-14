import {MultiTableSelection} from '../../parsing/selection/multi_table_selection_parsing'
import {generateColumnAccess} from '../column_access_generation'
import {generateAlias} from '../alias_generation'
import {joinWithCommaWhitespace} from '../../join'
import {computeTableAlias} from '../table_aliases'

export function generateMultiTableSelection(aliasEscape: string|null, selection: MultiTableSelection): string {
    return joinWithCommaWhitespace(selection.namesPairedWithProperties
        .map(([name, properties], index) => {

            const tableAlias = computeTableAlias('t', index)

            const columns = properties
                .map(property => generateAlias(aliasEscape, generateColumnAccess(tableAlias, property), `${name}_${property}`) )

            return joinWithCommaWhitespace(columns)
        }))
}