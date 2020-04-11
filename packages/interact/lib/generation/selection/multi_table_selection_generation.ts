import {MultiTableSelection} from '../../parsing/selection/multi_table_selection_parsing'
import {generateColumnAccess} from '../column_access_generation'
import {generateAlias} from '../alias_generation'
import {joinWithCommaWhitespace} from '../../join'

export function generateMultiTableSelection(aliasEscape: string|null, selection: MultiTableSelection): string {
    const {nameToTable, properties} = selection

    return joinWithCommaWhitespace(properties
        .map(([alias, [name, property]]) => {
            const tableAlias = nameToTable[name]

            return generateAlias(aliasEscape, generateColumnAccess(tableAlias, property), alias)
        }))
}