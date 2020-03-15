export type AggregatableColumn<F> = {
    avg(): F
    count(): F
    max(): F
    min(): F
    sum(): F
}
export type AggregatableTable<T> = {
    [F in keyof T]: AggregatableColumn<F>
}