export interface MultiTableSelection {
    kind: 'multi-table-selection'
    names: string[]
}

export function createMultiTableSelection(names: string[]): MultiTableSelection {
    return {
        kind: 'multi-table-selection',
        names
    }
}