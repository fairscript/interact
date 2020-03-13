import {Constructor, SelectStatement} from '../select_statement'
import {SelectTable} from './select_table'
import {MapTable} from './map_table'
import {SelectSqlGenerator} from '../sql_generation'
import {parseOrder} from '../parsing/order_parsing'
import {Value} from '../column_operations'

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

    map<U>(f: (table: T) => U): MapTable<T, U> {
        return new MapTable(this.statement, f)
    }
}