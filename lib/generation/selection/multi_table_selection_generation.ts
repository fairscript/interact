import {joinWithCommaWhitespace} from '../../parsing/javascript_parsing'
import {MultiTableSelection} from '../../parsing/selection/multi_table_selection_parsing'
import {generateColumnAccess} from '../column_access_generation'

export function generateMultiTableSelection(selection: MultiTableSelection): string {
    const {nameToTable, properties} = selection

    return joinWithCommaWhitespace(properties
        .map(([alias, [name, property]]) => {
            const tableAlias = nameToTable[name]
            return `${generateColumnAccess(tableAlias, property)} AS ${alias}`
        }))
}