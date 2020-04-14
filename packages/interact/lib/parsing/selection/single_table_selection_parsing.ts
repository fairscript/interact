import {parseConstructor} from '../functions/constructor_parsing'

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

export function parseSingleTableSelection(constructor: Function): SingleTableSelection {
    const properties = parseConstructor(constructor)

    return createSingleTableSelection(properties)
}