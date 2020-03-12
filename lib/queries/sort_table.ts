import {Constructor, SelectStatement} from '../select_statement'
import {By, Order} from '../table'
import {SelectTable} from './select_table'
import {MapTable} from './map_table'
import {SelectSqlGenerator} from '../sql_generation'
import {parseOrder} from '../parsing/order_parsing'

export class SortTable<T> extends SelectSqlGenerator {

    constructor(
        private constructor: Constructor<T>,
        existingStatement: SelectStatement,
        additionalOrder: Order<T>) {

        super({
            ...existingStatement,
            orders: existingStatement.orders.concat(parseOrder(additionalOrder))
        })
    }

    thenBy(by: By<T>): SortTable<T> {
        return new SortTable(this.constructor, this.statement, {by, direction: 'asc'})
    }

    thenDescendinglyBy(by: By<T>): SortTable<T> {
        return new SortTable(this.constructor, this.statement, {by, direction: 'desc'})
    }

    select(): SelectTable<T> {
        return new SelectTable(this.constructor, this.statement)
    }

    map<U>(f: (x: T) => U): MapTable<T, U> {
        return new MapTable(this.statement, f)
    }


}