import {SubselectStatement} from './select_statement'
import {Value} from './value'

export interface GetFromParameter {
    kind: 'get-from-parameter'
    parameter: string,
    property: string,
}

export function createGetFromParameter(parameter: string, property: string): GetFromParameter {
    return {
        kind: 'get-from-parameter',
        parameter,
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