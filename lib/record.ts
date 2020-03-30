import {Value} from './value'
import {Avg, Count, Max, Min, Sum} from './queries/one/aggregatable_table'

export type EnforceNonEmptyRecord<R> = keyof R extends never ? never : R

export type ValueRecord = Record<string, Value>

interface NestedValueRecord extends Record<string, Value|NestedValueRecord> {}

export type ValueOrNestedValueRecord = Value|NestedValueRecord

export type TableAggregationRecord = Record<string, Max|Min|Avg|Sum|Count>