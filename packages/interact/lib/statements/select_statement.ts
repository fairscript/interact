import {TableSelection} from '../parsing/selection/selection_parsing'
import {Filter} from '../parsing/filtering/filter_parsing'
import {OrderExpression, parseSorting} from '../parsing/sorting/sorting_parsing'
import {JoinExpression, parseJoin} from '../parsing/join_parsing'
import {ColumnRecord, ValueOrNestedValueRecord} from '../record'
import {parseParameterlessFilter} from '../parsing/filtering/parameterless_filter_parsing'
import {parseParameterizedFilter} from '../parsing/filtering/parameterized_filter_parsing'
import {Direction} from '../queries/one/sort_table'
import {Table} from '../queries/one/table'

export interface Constructor<T> {
    new(...args: any[]): T
}

export interface SelectStatement {
    tableName: string
    columns: ColumnRecord
    filters: Filter[]
    joins: JoinExpression[]
    orders: OrderExpression[]
    selection: TableSelection | null
    distinct: boolean
    limit: number | 'all'
    offset: number,
    kind: 'select-statement'
}

export function createEmptySelectStatement<T>(tableName: string, columns: ColumnRecord): SelectStatement {
    return {
        tableName,
        columns,
        filters: [],
        joins: [],
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

export function addParameterizedFilter<P extends ValueOrNestedValueRecord>(statement: SelectStatement, predicate: Function, userProvided: P): SelectStatement {
    const existingFilters = statement.filters

    const prefix = `f${existingFilters.length + 1}`
    const additionalFilter = parseParameterizedFilter(predicate, prefix, userProvided)

    return {
        ...statement,
        filters: existingFilters.concat(additionalFilter)
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
    const existingJoins = statement.joins
    const additionalJoin = parseJoin(otherTable.tableName, otherTable.columns, left, right, statement.joins.length+1)

    return {
        ...statement,
        joins: existingJoins.concat(additionalJoin)
    }
}
