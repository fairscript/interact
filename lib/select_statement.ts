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
    selection: Selection|null
    distinct: boolean
    filters: Filter[]
    orders: OrderExpression[]
    join: JoinExpression|null
    key: Key|null
    limit: number|'all'
    offset: number
}

export function createEmptySelectStatement(tableName: string): SelectStatement {
    return {
        tableName,
        selection: null,
        distinct: false,
        filters: [],
        orders: [],
        join: null,
        key: null,
        limit: 'all',
        offset: 0
    }
}

export interface SubselectStatement {
    tableName: string
    filters: Filter[]
}

export function createSubselectStatement(tableName: string, filters: Filter[]): SubselectStatement {
    return {
        tableName,
        filters
    }
}
