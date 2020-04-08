import {Selection} from '../parsing/selection/selection_parsing'
import {Filter} from '../parsing/filtering/filter_parsing'
import {OrderExpression} from '../parsing/sorting/sorting_parsing'
import {JoinExpression} from '../parsing/join_parsing'

export interface Constructor<T> {
    new(...args: any[]): T
}

export interface SelectStatement {
    tableName: string
    filters: Filter[]
    join: JoinExpression | null
    orders: OrderExpression[]
    selection: Selection | null
    distinct: boolean
    limit: number | 'all'
    offset: number,
    kind: 'select-statement'
}

export function createEmptySelectStatement(tableName: string): SelectStatement {
    return {
        tableName,
        filters: [],
        join: null,
        orders: [],
        selection: null,
        distinct: false,
        limit: 'all',
        offset: 0,
        kind: 'select-statement'
    }
}