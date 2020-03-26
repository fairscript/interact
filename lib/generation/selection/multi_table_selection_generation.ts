import {MultiTableSelection} from '../../parsing/selection/multi_table_selection_parsing'
import {generateColumnAccess} from '../column_access_generation'
import {joinWithCommaWhitespace} from '../../parsing/parsing_helpers'
import {generateAlias} from '../alias_generation'

export function generateMultiTableSelection(selection: MultiTableSelection): string {
    const {nameToTable, properties} = selection

    return joinWithCommaWhitespace(properties
        .map(([alias, [name, property]]) => {
            const tableAlias = nameToTable[name]

            return generateAlias(generateColumnAccess(tableAlias, property), alias)
        }))
}