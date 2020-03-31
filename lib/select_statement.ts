import {Filter} from './parsing/filtering/filter_parsing'
import {OrderExpression} from './parsing/sorting/sorting_parsing'
import {JoinExpression} from './parsing/join_parsing'
import {Key} from './parsing/get_key_parsing'
import {Selection} from './parsing/selection/selection_parsing'
import {GroupOrderExpression} from './parsing/sorting/group_sorting_parsing'
import {CountSelection} from './parsing/selection/count_selection'
import {TableAggregationSelection} from './parsing/selection/table_aggregation_selection_parsing'
import {SingleColumnSelection} from './parsing/selection/single_column_selection_parsing'

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
    limit: number|'all'
    offset: number,
    kind: 'select-statement'
}

export function createEmptySelectStatement(tableName: string): SelectStatement {
    return {
        tableName,
        selection: null,
        distinct: false,
        filters: [],
        orders: [],
        join: null,
        limit: 'all',
        offset: 0,
        kind: 'select-statement'
    }
}

export interface GroupSelectStatement {
    tableName: string
    selection: Selection|null
    distinct: boolean
    filters: Filter[]
    orders: GroupOrderExpression[]
    join: JoinExpression|null
    key: Key
    limit: number|'all'
    offset: number,
    kind: 'group-select-statement'
}

export function createGroupSelectStatement(selectStatement: SelectStatement, key: Key): GroupSelectStatement {
    const { tableName, selection, distinct, filters, orders, join, limit, offset } = selectStatement

    return {
        tableName,
        selection,
        distinct,
        filters,
        join,
        limit,
        offset,
        key,
        orders: [],
        kind: 'group-select-statement'
    }
}

export interface SubselectStatement {
    tableName: string
    filters: Filter[],
    selection: CountSelection|SingleColumnSelection
    kind: 'subselect-statement'
}

export function createSubselectStatement(tableName: string, filters: Filter[], selection: CountSelection|SingleColumnSelection): SubselectStatement {
    return {
        tableName,
        filters,
        selection,
        kind: 'subselect-statement'
    }
}
