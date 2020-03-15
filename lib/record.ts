import {Value} from './value'
import {ColumnSelection} from './queries/selection'

export type EnforceNonEmptyRecord<R> = keyof R extends never ? never : R

export type StringValueRecord = Record<string, Value>

export type StringValueOrColumnSelectionRecord = Record<string, Value|ColumnSelection<Value>>

export type ColumnSelectionToValue<T> = {
    [K in keyof T]: T[K] extends ColumnSelection<infer V> ? V : T[K]
}