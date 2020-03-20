import {parseLambdaFunction} from '../lambda_parsing'
import {parseConstructor} from '../constructor_parsing'

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

export function parseSelectMultipleTables(pairs: [string, Function][]): MultiTableSelection {
    const nameToTable = pairs.reduce(
        (acc, [name, _], index) => {
            acc[name] = `t${index + 1}`
            return acc
        },
        {})

    const operations = pairs.reduce(
        (acc, [name, table]) => {
            const properties = parseConstructor(table)

            const tableAliases = properties
                .map(property => [`${name}_${property}`, [name, property]])

            return acc.concat(tableAliases)
        },
        []
    )

    return createMultiTableSelection(nameToTable, operations)
}