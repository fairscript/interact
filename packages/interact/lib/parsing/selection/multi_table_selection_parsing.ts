import {ColumnRecord} from '../../record'

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

export function parseMultipleTableSelection(names: string[], columnRecords: ColumnRecord[]): MultiTableSelection {
    const namesPairedWithProperties = names.reduce(
        (acc, name, index) => {
            acc.push([name, Object.keys(columnRecords[index])])
            return acc
        },
        [] as [string, string[]][]
    )

    return createMultiTableSelection(namesPairedWithProperties)
}