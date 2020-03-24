import {SubselectStatement} from './select_statement'
import {Value} from './value'

export interface GetProvided {
    kind: 'get-provided',
    prefix: string,
    placeholder: string,
    path: string[]
}

export function createGetProvided(prefix: string, placeholder: string, path: string[]): GetProvided {
    return {
        kind: 'get-provided',
        prefix,
        placeholder,
        path
    }
}

export interface GetColumn {
    kind: 'get-column'
    object: string,
    property: string,
}

export function createGetColumn(object: string, property: string): GetColumn {
    return {
        kind: 'get-column',
        object,
        property
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

export interface Constant {
    kind: 'constant'
    value: Value
}

export function createConstant(value: Value): Constant {
    return {
        kind: 'constant',
        value
    }
}