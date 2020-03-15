import {Value} from './value'
import {ColumnSelection} from './queries/selection'

export type EnforceNonEmptyRecord<R> = keyof R extends never ? never : R

export type StringValueRecord = Record<string, Value>

export type StringValueOrColumnSelectionRecord = Record<string, Value|ColumnSelection>