import * as getParameterNames from 'get-parameter-names'
import {createGet, Get, Alias, createAlias} from '../column_operations'
import {createFindTableIndex} from './table_index'

export function parseSingleTableSelect(constructor: Function): Get[] {
    return getParameterNames(constructor)
        .map(property => createGet(1, property))
}

export function parseMultiTableSelect(tables: { [tableName: string]: Function }): Alias[] {
    const propertyNames = Object.keys(tables)
    const findTableIndex = createFindTableIndex(propertyNames)

    return propertyNames.reduce((acc, key, index) => {
        const tableIndex = findTableIndex(key)

        const tableAliases = getParameterNames(tables[key])
            .map(property => createAlias(createGet(tableIndex, property), `${key}_${property}`))

        return acc.concat(tableAliases)
    }, [])
}
