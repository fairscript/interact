import {Value} from './value'
import {GetColumnFromTable} from './queries/selections/get_column_from_table'

export type EnforceNonEmptyRecord<R> = keyof R extends never ? never : R

export type StringValueRecord = Record<string, Value>

export type StringValueOrGetColumnRecord = Record<string, Value|GetColumnFromTable>