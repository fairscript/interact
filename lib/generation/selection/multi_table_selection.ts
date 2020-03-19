import * as toSnakeCase from 'js-snakecase'

import {MultiTableSelection} from '../../parsing/select_parsing'
import {joinWithCommaWhitespace} from '../../parsing/javascript_parsing'

export function generateMultiTableSelection(selection: MultiTableSelection): string {
    const {nameToTable, properties} = selection

    return joinWithCommaWhitespace(properties
        .map(([alias, [name, property]]) => {
            const table = nameToTable[name]
            const column = toSnakeCase(property)
            return `${table}.${column} AS ${alias}`
        }))
}