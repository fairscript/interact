import {SubselectStatement} from './select_statement'

export type AliasedColumnOperation = Get | Aggregate | Count | Subselect
export type ColumnOperation = Alias | AliasedColumnOperation

export interface Alias {
    kind: 'alias'
    operation: AliasedColumnOperation
    alias: string,
}

export function createAlias(operation: AliasedColumnOperation, alias: string): Alias {
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

export interface Count {
    kind: 'count'
}

export function createCount(): Count {
    return {
        kind: 'count'
    }
}

export interface Subselect {
    statement: SubselectStatement
    kind: 'subselect'
}

export function createSubselect(statement: SubselectStatement): Subselect {
    return {
        statement,
        kind: 'subselect'
    }
}