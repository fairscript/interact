import {generateColumnAccess} from '../column_access_generation'
import {Key} from '../../parsing/get_key_parsing'
import {generateGetColumn} from '../value_expressions/get_column_generation'
import {joinWithCommaWhitespace} from '../../join'

export function generateGetPartOfKey(partOfKeyToTableAndProperty: { [part: string]: [string, string] }, part: string): string {
    const [tableAlias, property] = partOfKeyToTableAndProperty[part]

    return generateColumnAccess(tableAlias, property)
}

export function generateKey(key: Key): string {
    const {parameterToTable, parts} = key

    return joinWithCommaWhitespace(parts.map(part => generateGetColumn(parameterToTable, part.get)))
}