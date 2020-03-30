import {parseConstructor} from '../javascript/constructor_parsing'

export interface MultiTableSelection {
    kind: 'multi-table-selection'
    nameToTable: { [key: string]: string },
    properties: [string, [string, string]][]
}

export function createMultiTableSelection(nameToTable: { [key: string]: string }, properties: [string, [string, string]][]): MultiTableSelection {
    return {
        kind: 'multi-table-selection',
        nameToTable,
        properties
    }
}

export function parseMultipleTableSelection(pairs: [string, Function][]): MultiTableSelection {
    const nameToTable = pairs.reduce(
        (acc, [name, _], index) => {
            acc[name] = `t${index + 1}`
            return acc
        },
        {})

    const operations = pairs.reduce(
        (acc, [name, table]) => {
            const properties = parseConstructor(table)

            const tableAliases: [string, [string, string]][] = properties
                .map(property => [`${name}_${property}`, [name, property]])

            return acc.concat(tableAliases)
        },
        [] as [string, [string, string]][]
    )

    return createMultiTableSelection(nameToTable, operations)
}