import {Value} from './value'
import {ColumnType} from './queries/one/table'
import {SelectStatement} from './statements/select_statement'
import {GroupSelectStatement} from './statements/group_select_statement'

export type EnforceNonEmptyRecord<R> = keyof R extends never ? never : R

export type ValueRecord = Record<string, Value>

interface NestedValueRecord extends Record<string, Value|NestedValueRecord> {}

export type ValueOrNestedValueRecord = Value|NestedValueRecord

export type ColumnTypeRecord = Record<string, ColumnType>

export function collectColumnTypeRecords(statement: SelectStatement|GroupSelectStatement): ColumnTypeRecord[] {
    return [statement.columns].concat(statement.joins.map(j => j.columns))
}