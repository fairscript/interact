import {GroupSelection} from '../parsing/selection/selection_parsing'
import {Filter} from '../parsing/filtering/filter_parsing'
import {GroupOrderExpression, parseGroupSorting} from '../parsing/sorting/group_sorting_parsing'
import {JoinExpression} from '../parsing/join_parsing'
import {Key, parseGetKey} from '../parsing/get_key_parsing'
import {Direction} from '../queries/one/sort_table'
import {SelectStatement} from './select_statement'
import {ColumnTypeRecord} from '../record'

export interface GroupSelectStatement {
    tableName: string
    columns: ColumnTypeRecord
    key: Key
    filters: Filter[]
    joins: JoinExpression[]
    orders: GroupOrderExpression[]
    selection: GroupSelection | null
    limit: number | 'all'
    offset: number,
    distinct: boolean
    kind: 'group-select-statement'
}

export function createEmptyGroupSelectStatement(tableName: string, columns: ColumnTypeRecord, key: Key): GroupSelectStatement {
    return {
        tableName,
        columns,
        key,
        filters: [],
        joins: [],
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
        orders: statement.orders.concat(parseGroupSorting(sortBy!, direction, statement.key, statement.joins.length+1))
    }
}

export function addAscendingGroupOrder(statement: GroupSelectStatement, sortBy: Function): GroupSelectStatement {
    return addGroupOrder(statement, sortBy, 'asc')
}

export function addDescendingGroupOrder(statement: GroupSelectStatement, sortBy: Function): GroupSelectStatement {
    return addGroupOrder(statement, sortBy, 'desc')
}

export function groupTablesBy<T>(selectStatement: SelectStatement, getKey: Function): GroupSelectStatement {
    return {
        ...createEmptyGroupSelectStatement(
            selectStatement.tableName,
            selectStatement.columns,
            parseGetKey(getKey)
        ),
        filters: selectStatement.filters,
        joins: selectStatement.joins
    }
}