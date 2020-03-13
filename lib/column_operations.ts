export type Value = string | number

export type ColumnOperation = Alias | Get | Aggregate | AccessKey

export interface Alias {
    kind: 'alias'
    operation: Get | Aggregate
    alias: string,
}

export function createAlias(operation: Get | Aggregate, alias: string): Alias {
    return {
        kind: 'alias',
        operation,
        alias
    }
}

export interface Aggregate {
    kind: 'aggregate'
    aggregation: 'avg' | 'count' | 'min' | 'max' | 'sum'
    get: Get
}

export function createAggregate(aggregation: 'avg' | 'count' | 'min' | 'max' | 'sum', get: Get): Aggregate {
    return {
        kind: 'aggregate',
        aggregation,
        get
    }
}

export type TableIndex = 1 | 2

export interface Get {
    kind: 'get'
    table: TableIndex | null,
    column: string,
}

export function createGet(table: TableIndex | null, column: string): Get {
    return {
        kind: 'get',
        table,
        column
    }
}

export interface AccessKey {
    kind: 'access-key'
    property: string,
    alias: string
}

export function createAccessKey(property: string | null, alias: string): AccessKey {
    return {
        kind: 'access-key',
        property,
        alias
    }
}