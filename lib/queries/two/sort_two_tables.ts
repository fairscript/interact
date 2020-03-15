import {Constructor, SelectStatement} from '../../select_statement'
import {SelectSqlGenerator} from '../../sql_generation'
import {parseOrder} from '../../parsing/order_parsing'
import {SelectTwoTables} from './select_two_tables'
import {MapTwoTables} from './map_two_tables'
import {Direction} from '../one/sort_table'
import {GetColumnFromTwoTables} from './get_column_from_two_tables'
import {EnforceNonEmptyRecord, StringValueRecord} from '../../record'
import {GroupTwoTables} from './group_two_tables'
import {Value} from '../../value'

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

    get<U extends Value>(f: (first: T1, second: T2) => U): GetColumnFromTwoTables<T1, T2, U> {
        return new GetColumnFromTwoTables(this.statement, f)
    }

    map<U extends StringValueRecord>(f: (first: T1, second: T2) => EnforceNonEmptyRecord<U> & U): MapTwoTables<T1, T2, U> {
        return new MapTwoTables(this.statement, f)
    }

    groupBy<K extends StringValueRecord>(getKey: (first: T1, second: T2) => EnforceNonEmptyRecord<K> & K) : GroupTwoTables<T1, T2, K>{
        return new GroupTwoTables<T1, T2, K>(this.statement, getKey)
    }
}