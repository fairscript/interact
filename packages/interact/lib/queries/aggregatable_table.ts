export type NumberAggregation = {
    avg(): number
    max(): number
    min(): number
    sum(): number
}

export type BooleanAggregation = {
    avg(): number
    max(): boolean
    min(): boolean
    sum(): number
}

export type AggregatableTable<T> = {
    [F in keyof T]: T[F] extends number ? NumberAggregation : BooleanAggregation
}