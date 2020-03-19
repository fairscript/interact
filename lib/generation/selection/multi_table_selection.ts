import * as toSnakeCase from 'js-snakecase'

import {joinWithCommaWhitespace} from '../../parsing/javascript_parsing'
import {MultiTableSelection} from '../../parsing/selection/multi_table_selection_parsing'

export function generateMultiTableSelection(selection: MultiTableSelection): string {
    const {nameToTable, properties} = selection

    return joinWithCommaWhitespace(properties
        .map(([alias, [name, property]]) => {
            const table = nameToTable[name]
            const column = toSnakeCase(property)
            return `${table}.${column} AS ${alias}`
        }))
}