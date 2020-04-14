import {parseConstructor} from '../functions/constructor_parsing'

export interface MultiTableSelection {
    kind: 'multi-table-selection'
    namesPairedWithProperties: [string, string[]][]
}

export function createMultiTableSelection(namesPairedWithProperties: [string, string[]][]): MultiTableSelection {
    return {
        kind: 'multi-table-selection',
        namesPairedWithProperties
    }
}

export function parseMultipleTableSelection(pairs: [string, Function][]): MultiTableSelection {
    const namesPairedWithProperties = pairs.map(([name , table]) =>
        [name, parseConstructor(table)] as [string, string[]]
    )

    return createMultiTableSelection(namesPairedWithProperties)
}