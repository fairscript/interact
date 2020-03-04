interface AggregatableField<F> {
    avg(): F
    count(): F
    max(): F
    min(): F
    sum(): F
}

export type Aggregatable<T> = {
    [F in keyof T]: AggregatableField<F>
}