import {Filter} from './parsing/filter_parsing'
import {OrderExpression} from './parsing/order_parsing'
import {JoinExpression} from './parsing/join_parsing'
import {Key} from './parsing/get_key_parsing'
import {Selection} from './parsing/selection_parsing'

export interface Constructor<T> {
    new (...args: any[]): T
}

export interface SelectStatement {
    tableName: string
    selection: Selection
    filters: Filter[]
    orders: OrderExpression[]
    join: JoinExpression
    key: Key|null,

    kind: 'select-statement'
}

export function createEmptySelectStatement(tableName: string): SelectStatement {
    return {
        tableName,
        selection: null,
        filters: [],
        orders: [],
        join: null,
        key: null,
        kind: 'select-statement'
    }
}

export interface SubselectStatement {
    tableName: string
    filters: Filter[]
    kind: 'subselect-statement'
}

export function createSubselectStatement(tableName: string, filters: Filter[]): SubselectStatement {
    return {
        tableName,
        filters,
        kind: 'subselect-statement'
    }
}
