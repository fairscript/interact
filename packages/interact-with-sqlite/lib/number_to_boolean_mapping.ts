import {ValueRecord} from '@fairscript/interact/lib/record'

export function mapNumberToBoolean(input: number): boolean {
    return input === 1
}

export function createMapNumberValuesInRowToBooleans(keys: string[]): (input: ValueRecord) => ValueRecord {
    function f(input: Object) {
        return Object.keys(input).reduce(
            (acc, key) => {
                const value = input[key]
                acc[key] = keys.includes(key) ? mapNumberToBoolean(value as number) : value
                return acc
            },
            {} as ValueRecord)
    }

    return f
}

export function createMapNumberValuesInSetOfRowsToBooleans(booleanResultColumns: { [set: string]: string[] }): (input: { [name: string]: ValueRecord }) => { [name: string]: ValueRecord } {

    function f(set: { [name: string]: ValueRecord }): { [set: string]: ValueRecord } {
        return Object.keys(set).reduce(
            (adaptedSet, name) => {
                const row = set[name]

                if ((booleanResultColumns as Object).hasOwnProperty(name)) {
                    const booleanResultColumnsInSet = booleanResultColumns[name]

                    adaptedSet[name] = Object.keys(row).reduce(
                        (adaptedRow, column) => {
                            if (booleanResultColumnsInSet.includes(column)) {
                                adaptedRow[column] = mapNumberToBoolean(row[column] as number)
                            } else {
                                adaptedRow[column] = row[column]
                            }

                            return adaptedRow
                        },
                        {}
                    )
                } else {
                    adaptedSet[name] = row
                }

                return adaptedSet
            },
            {}
        )
    }

    return f

}