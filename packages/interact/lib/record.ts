import {Value} from './value'
import {Avg, Count, Max, Min, Sum} from './queries/aggregatable_table'
import {SelectStatement} from './statements/select_statement'

export type EnforceNonEmptyRecord<R> = keyof R extends never ? never : R

export type ValueRecord = Record<string, Value>

interface NestedValueRecord extends Record<string, Value|NestedValueRecord> {}

export type ValueOrNestedValueRecord = Value|NestedValueRecord

export type TableAggregationRecord = Record<string, Max|Min|Avg|Sum|Count>

export type ColumnRecord = Record<string, 'string'|'number'|'boolean'>

export function collectColumnRecords(selectStatement: SelectStatement): ColumnRecord[] {
    return [selectStatement.columns].concat(selectStatement.joins.map(j => j.columns))
}