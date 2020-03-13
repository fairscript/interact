import {Constructor, SelectStatement} from '../select_statement'
import {SelectTable} from './select_table'
import {MapTable} from './map_table'
import {SelectSqlGenerator} from '../sql_generation'
import {parseOrder} from '../parsing/order_parsing'
import {Value} from '../column_operations'
import {SelectTwoTables} from './select_two_tables'
import {MapTwoTables} from './map_two_tables'
import {Direction} from './sort_table'

export class SortTwoTables<T1, T2> extends SelectSqlGenerator {

    constructor(
        private firstConstructor: Constructor<T1>,
        private secondConstructor: Constructor<T2>,
        existingStatement: SelectStatement,
        sortBy: (first: T1, second: T2) => Value,
        direction: Direction) {

        super({
            ...existingStatement,
            orders: existingStatement.orders.concat(parseOrder(sortBy, direction))
        })
    }

    thenBy(sortBy: (first: T1, second: T2) => Value): SortTwoTables<T1, T2> {
        return new SortTwoTables(this.firstConstructor, this.secondConstructor, this.statement, sortBy, 'asc')
    }

    thenDescendinglyBy(sortBy: (first: T1, second: T2) => Value): SortTwoTables<T1, T2> {
        return new SortTwoTables(this.firstConstructor, this.secondConstructor, this.statement, sortBy, 'desc')
    }

    select(first: string, second: string): SelectTwoTables<T1, T2> {
        return new SelectTwoTables(this.firstConstructor, this.secondConstructor, this.statement, first, second)
    }

    map<U>(f: (first: T1, second: T2) => U): MapTwoTables<T1, T2, U> {
        return new MapTwoTables(this.statement, f)
    }
}