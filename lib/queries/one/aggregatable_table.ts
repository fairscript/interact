export interface Count {}
export interface Max {}
export interface Min {}
export interface Avg {}
export interface Sum {}

export type AggregatableColumn = {
    avg(): Avg
    max(): Max
    min(): Min
    sum(): Sum
}
export type AggregatableTable<T> = {
    [F in keyof T]: AggregatableColumn
}

export type GroupAggregationRecord<K> = Record<string, K|Max|Min|Avg|Sum|Count>