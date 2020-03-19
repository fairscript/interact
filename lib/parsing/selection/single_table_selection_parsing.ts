import * as getParameterNames from 'get-parameter-names'
import {Selection} from '../selection_parsing'

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