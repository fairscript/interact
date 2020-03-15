import {Constructor, SelectStatement} from '../../select_statement'
import {SelectTable} from './select_table'
import {MapTable} from './map_table'
import {SelectSqlGenerator} from '../../sql_generation'
import {parseOrder} from '../../parsing/order_parsing'
import {Value} from '../../column_operations'
import {GetColumnFromTable} from './get_column_from_table'

export type Direction = 'asc' | 'desc'

export class SortTable<T> extends SelectSqlGenerator {

    constructor(
        private constructor: Constructor<T>,
        existingStatement: SelectStatement,
        sortBy: (x: T) => Value,
        direction: Direction) {

        super({
            ...existingStatement,
            orders: existingStatement.orders.concat(parseOrder(sortBy, direction))
        })
    }

    thenBy(sortBy: (table: T) => Value): SortTable<T> {
        return new SortTable(this.constructor, this.statement, sortBy, 'asc')
    }

    thenDescendinglyBy(sortBy: (table: T) => Value): SortTable<T> {
        return new SortTable(this.constructor, this.statement, sortBy, 'desc')
    }

    select(): SelectTable<T> {
        return new SelectTable(this.constructor, this.statement)
    }

    get<U extends Value>(f: (table: T) => U): GetColumnFromTable<T, U> {
        return new GetColumnFromTable(this.statement, f)
    }

    map<U extends Record<string, Value>>(f: (table: T) => U): MapTable<T, U> {
        return new MapTable(this.statement, f)
    }
}