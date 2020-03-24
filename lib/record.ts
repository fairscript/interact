import {Value} from './value'

export type EnforceNonEmptyRecord<R> = keyof R extends never ? never : R

export type StringValueRecord = Record<string, Value>

interface NestedStringValueRecord extends Record<string, Value|NestedStringValueRecord> {}

export type ValueOrNestedStringValueRecord = Value|NestedStringValueRecord
