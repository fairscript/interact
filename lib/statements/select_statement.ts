import {Selection} from '../parsing/selection/selection_parsing'
import {Filter} from '../parsing/filtering/filter_parsing'
import {OrderExpression, parseSorting} from '../parsing/sorting/sorting_parsing'
import {JoinExpression, parseJoin} from '../parsing/join_parsing'
import {ValueOrNestedValueRecord} from '../record'
import {parseParameterlessFilter} from '../parsing/filtering/parameterless_filter_parsing'
import {parseParameterizedFilter} from '../parsing/filtering/parameterized_filter_parsing'
import {Direction} from '../queries/one/sort_table'
import {Table} from '../queries/one/table'

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

export function addParameterlessFilter(statement: SelectStatement, predicate: Function): SelectStatement {
    return {
        ...statement,
        filters: statement.filters.concat(parseParameterlessFilter(predicate))
    }
}

export function addParameterizedFilter<P extends ValueOrNestedValueRecord>(statement: SelectStatement, predicate: Function, prefix: string, userProvided: P): SelectStatement {
    return {
        ...statement,
        filters: statement.filters.concat(parseParameterizedFilter(predicate, prefix, userProvided))
    }
}

function addOrder(statement: SelectStatement, sortBy: Function, direction: Direction): SelectStatement {
    return {
        ...statement,
        orders: statement.orders.concat(parseSorting(sortBy, direction))
    }
}

export function addAscendingOrder(statement: SelectStatement, sortBy: Function): SelectStatement {
    return addOrder(statement, sortBy, 'asc')
}

export function addDescendingOrder(statement: SelectStatement, sortBy: Function): SelectStatement {
    return addOrder(statement, sortBy, 'desc')
}

export function joinTable<T>(statement: SelectStatement, otherTable: Table<T>, left: Function, right: Function): SelectStatement {
    return {
        ...statement,
        join: parseJoin(otherTable.tableName, left, right)
    }
}