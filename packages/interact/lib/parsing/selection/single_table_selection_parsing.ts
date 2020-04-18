export interface SingleTableSelection {
    kind: 'single-table-selection'
}

export function createSingleTableSelection(): SingleTableSelection {
    return {
        kind: 'single-table-selection',
    }
}