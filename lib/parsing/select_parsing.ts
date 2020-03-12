import * as getParameterNames from 'get-parameter-names'
import {Constructor} from '../select_statement'

export type PropertyOperation = Alias|Aggregate|Get|AccessKey

export interface Alias {
    kind: 'alias'
    operation: Get|Aggregate
    alias: string,
}

export function createAlias(operation: Get|Aggregate, alias: string): Alias {
    return {
        kind: 'alias',
        operation,
        alias
    }
}

export interface Aggregate {
    kind: 'aggregate'
    aggregation: 'avg'|'count'|'min'|'max'|'sum'
    get: Get
}

export function createAggregate(aggregation: 'avg'|'count'|'min'|'max'|'sum', get: Get): Aggregate {
    return {
        kind: 'aggregate',
        aggregation,
        get
    }
}

export interface Get {
    kind: 'get'
    object: string|null,
    property: string,
}

export function createGet(object: string|null, property: string): Get {
    return {
        kind: 'get',
        object,
        property
    }
}

export interface AccessKey {
    kind: 'access-key'
    property: string,
    alias: string
}

export function createAccessKey(property: string|null, alias: string): AccessKey {
    return {
        kind: 'access-key',
        property,
        alias
    }
}

export function extractPropertiesFromConstructor<T>(constructor: Constructor<T>): Array<PropertyOperation> {
    return getParameterNames(constructor)
        .map(property => createGet(null, property))
}
