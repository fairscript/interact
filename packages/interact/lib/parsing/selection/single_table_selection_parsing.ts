import {ColumnRecord} from '../../record'

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

export function parseSingleTableSelection(columns: ColumnRecord): SingleTableSelection {
    const properties = Object.keys(columns)

    return createSingleTableSelection(properties)
}