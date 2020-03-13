import {Constructor, SelectStatement} from '../select_statement'
import {SelectTable} from './select_table'
import {MapTable} from './map_table'
import {SelectSqlGenerator} from '../sql_generation'
import {parseOrder} from '../parsing/order_parsing'
import {Value} from '../column_operations'

export interface Order<T> {
    sortBy: (x: T) => Value
    direction: 'asc' | 'desc'
}


export class SortedTable<T> extends SelectSqlGenerator {

    constructor(
        private constructor: Constructor<T>,
        existingStatement: SelectStatement,
        additionalOrder: Order<T>) {

        super({
            ...existingStatement,
            orders: existingStatement.orders.concat(parseOrder(additionalOrder))
        })
    }

    thenBy(sortBy: (table: T) => Value): SortedTable<T> {
        return new SortedTable(this.constructor, this.statement, {sortBy, direction: 'asc'})
    }

    thenDescendinglyBy(sortBy: (table: T) => Value): SortedTable<T> {
        return new SortedTable(this.constructor, this.statement, {sortBy, direction: 'desc'})
    }

    select(): SelectTable<T> {
        return new SelectTable(this.constructor, this.statement)
    }

    map<U>(f: (table: T) => U): MapTable<T, U> {
        return new MapTable(this.statement, f)
    }
}