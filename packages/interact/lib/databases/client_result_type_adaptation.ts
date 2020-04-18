import {Value} from '../value'
import {ValueRecord} from '../record'
import {ColumnTypeMapping, ColumnTypeMappingRecord} from './result_columns'
import {ColumnType} from '../queries/one/table'

function createAdaptDialectSpecificClientResultTypeOfValue<T extends Value>(
    clientBooleanResultType: 'boolean' | 'number',
    clientFloatResultType: 'number' | 'string',
    columnType: ColumnType): ((input: Value) => T)|null {

    switch (columnType) {
        case 'string':
        case 'integer':
            return null
        case 'boolean':
            if (clientBooleanResultType === 'number') {
                return value => (value === 1) as any
            }
            else {
                return null
            }
        case 'float':
            if (clientFloatResultType === 'string') {
                return value => parseFloat(value as any) as any
            }
            else {
                return null
            }
    }

}

export function createAdaptClientResultTypeOfValue<T extends Value>(
    clientBooleanResultType: 'boolean' | 'number',
    clientFloatResultType: 'number' | 'string',
    columnTypeMapping: ColumnTypeMapping): ((input: Value) => T)|null {

    const [typeReturnedByTheClient, typeAssumedByTheApi] = columnTypeMapping

    const clientSpecificAdaptation = createAdaptDialectSpecificClientResultTypeOfValue<T>(clientBooleanResultType, clientFloatResultType, typeReturnedByTheClient)

    if (typeReturnedByTheClient === typeAssumedByTheApi) {
        return clientSpecificAdaptation
    }
    else if (typeReturnedByTheClient === 'integer' && typeAssumedByTheApi === 'boolean') {
        if (clientSpecificAdaptation === null) {
            return ((input: Value) => input === 1) as any
        }
        else {
            return ((input: Value) => clientSpecificAdaptation(input) === 1) as any
        }
    }
    else {
        throw Error('Not implemented')
    }
}

export function adaptResultTypeOfPromisedScalar<T extends Value>(
    promiseOfScalar: Promise<T>,
    map: ((input: Value) => T)|null): Promise<T> {
    if (map === null) {
        return promiseOfScalar
    }
    else {
        return promiseOfScalar.then(scalar => map(scalar))
    }
}

export function adaptResultTypeInPromisedVector<T extends Value>(
    promiseOfVector: Promise<T[]>,
    map: ((input: Value) => T)|null): Promise<T[]> {
    if (map === null) {
        return promiseOfVector
    }
    else {
        return promiseOfVector.then(vector => vector.map(map))
    }
}


export function createAdaptResultTypesInValueRecord<T extends ValueRecord>(
    clientBooleanResultType: 'boolean' | "number",
    clientFloatResultType: 'number' | 'string',
    columnTypeRecord: ColumnTypeMappingRecord): ((input: ValueRecord) => T)|null {

    const keys = Object.keys(columnTypeRecord) as any

    const columnMaps = keys.reduce(
        (acc, key) => {

            const columnMap = createAdaptClientResultTypeOfValue(clientBooleanResultType, clientFloatResultType, columnTypeRecord[key])

            if (columnMap !== null) {
                acc[key] = columnMap
            }

            return acc
        },
        {} as { [K in keyof T]?: ((input: any) => T[K])|null}
    )

    if (Object.keys(columnMaps).length === 0) {
        return null
    }
    else {
        return (input: ValueRecord) =>
            Object.keys(input).reduce(
                (acc, key) => {
                    const value = input[key]
                    acc[key] = columnMaps.hasOwnProperty(key) ? columnMaps[key](value) : value
                    return acc
                },
                {} as ValueRecord
            ) as T
    }
}

export function adaptResultTypeInPromisedRow<T extends ValueRecord>(
    promiseOfRow: Promise<T>,
    map: ((input: ValueRecord) => T)|null): Promise<T> {
    if (map === null) {
        return promiseOfRow
    }
    else {
        return promiseOfRow.then(row => map(row))
    }
}

export function adaptResultTypeInPromisedRows<T extends ValueRecord>(
    promiseOfRows: Promise<T[]>,
    map: ((input: ValueRecord) => T)|null): Promise<T[]> {
    if (map === null) {
        return promiseOfRows
    }
    else {
        return promiseOfRows.then(rows => rows.map(map))
    }
}

export function createAdaptResultTypesInSetOfRow<T extends {[set: string]: ValueRecord}>(
    clientBooleanResultType: 'boolean' | "number",
    clientFloatResultType: 'number' | 'string',
    columnTypeRecord: {[set: string]: ColumnTypeMappingRecord}): ((input: {[set: string]: ValueRecord}) => T)|null {

    const rowMaps = Object
        .keys(columnTypeRecord)
        .reduce(
            (acc, set) => {
                const rowMap = createAdaptResultTypesInValueRecord(clientBooleanResultType, clientFloatResultType, columnTypeRecord[set])

                if (rowMap !== null) {
                    acc[set] = rowMap
                }

                return acc
            },
            {} as {[set: string]: (input: ValueRecord) => ValueRecord}
        )

    if (Object.keys(rowMaps).length === 0) {
        return null
    }
    else {
        return (input: {[set: string]: ValueRecord}) =>
            Object.keys(input).reduce(
                (acc, key) => {
                    const row = input[key]

                    acc[key] = rowMaps.hasOwnProperty(key) ? rowMaps[key](row) : row
                    return acc
                },
                {} as {[set: string]: ValueRecord}
            ) as T
    }
}

export function adaptResultTypesInPromisedSetOfRows<T extends {[set: string]: ValueRecord}>(
    promiseOfRow: Promise<T>,
    map: ((input: {[set: string]: ValueRecord}) => T)|null): Promise<T> {
    if (map === null) {
        return promiseOfRow
    }
    else {
        return promiseOfRow.then(row => map(row))
    }
}

export function adaptResultTypesInPromisedSetsOfRows<T extends {[set: string]: ValueRecord}>(
    promiseOfRows: Promise<T[]>,
    map: ((input: {[set: string]: ValueRecord}) => T)|null): Promise<T[]> {
    if (map === null) {
        return promiseOfRows
    }
    else {
        return promiseOfRows.then(rows => rows.map(map))
    }
}