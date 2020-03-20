import {Selection} from '../selection_parsing'
import {parseConstructor} from '../constructor_parsing'

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
    const properties = parseConstructor(constructor)

    return createSingleTableSelection(properties)
}