import {Selection} from '../parsing/selection/selection_parsing'
import {Filter} from '../parsing/filtering/filter_parsing'
import {GroupOrderExpression, parseGroupSorting} from '../parsing/sorting/group_sorting_parsing'
import {JoinExpression} from '../parsing/join_parsing'
import {Key, parseGetKey} from '../parsing/get_key_parsing'
import {Direction} from '../queries/one/sort_table'
import {SelectStatement} from './select_statement'

export interface GroupSelectStatement {
    tableName: string
    key: Key
    filters: Filter[]
    join: JoinExpression | null
    orders: GroupOrderExpression[]
    selection: Selection | null
    limit: number | 'all'
    offset: number,
    distinct: boolean
    kind: 'group-select-statement'
}

export function createEmptyGroupSelectStatement(tableName: string, key: Key): GroupSelectStatement {
    return {
        tableName,
        key,
        filters: [],
        join: null,
        orders: [],
        selection: null,
        limit: 'all',
        offset: 0,
        distinct: false,
        kind: 'group-select-statement'
    }
}

function addGroupOrder(statement: GroupSelectStatement, sortBy: Function, direction: Direction): GroupSelectStatement {
    return {
        ...statement,
        orders: statement.orders.concat(parseGroupSorting(sortBy!, direction, statement.key, statement.join === null ? 1 : 2))
    }
}

export function addAscendingGroupOrder(statement: GroupSelectStatement, sortBy: Function): GroupSelectStatement {
    return addGroupOrder(statement, sortBy, 'asc')
}

export function addDescendinGroupOrder(statement: GroupSelectStatement, sortBy: Function): GroupSelectStatement {
    return addGroupOrder(statement, sortBy, 'desc')
}

export function groupTablesBy<T>(statement: SelectStatement, getKey: Function): GroupSelectStatement {
    return {
        ...createEmptyGroupSelectStatement(
            statement.tableName,
            parseGetKey(getKey)
        ),
        filters: statement.filters
    }
}