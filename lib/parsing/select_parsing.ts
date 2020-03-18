import * as getParameterNames from 'get-parameter-names'
import {GetSelection} from './get_parsing'
import {MapSelection} from './map_parsing'
import {Aggregation} from './aggregation_parsing'
import {CountSelection} from './count_selection'

export type Selection = Aggregation|CountSelection|GetSelection|SingleTableSelection|MapSelection|MultiTableSelection

export interface SingleTableSelection {
    kind: 'single-table-selection'
    properties: string[]
}

export function createSingleTableSelection(properties: string[]): SingleTableSelection {
    return {
        kind: 'single-table-selection',
        properties
    }
}

export function parseSelectSingleTable(constructor: Function): Selection {
    const operations = getParameterNames(constructor)

    return createSingleTableSelection(operations)
}

export interface MultiTableSelection {
    kind: 'multi-table-selection'
    nameToTable: {[key: string]: string},
    properties: [string, [string, string]][]
}

export function createMultiTableSelection(nameToTable: {[key: string]: string}, properties: [string, [string, string]][]): MultiTableSelection {
    return {
        kind: 'multi-table-selection',
        nameToTable,
        properties
    }
}

export function parseSelectMultipleTables(pairs: [string, Function][]): MultiTableSelection {
    const nameToTable =  pairs.reduce(
        (acc, [name, _], index) => {
            acc[name] = `t${index+1}`
            return acc
        },
        {})

    const operations = pairs.reduce(
        (acc, [name, table]) => {
            const tableAliases = getParameterNames(table)
                .map(property => [`${name}_${property}`, [name, property]])

            return acc.concat(tableAliases)
        },
        []
    )

    return createMultiTableSelection(nameToTable, operations)
}
