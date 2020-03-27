import {Constructor, SelectStatement} from '../../select_statement'
import {parseOrder} from '../../parsing/order_parsing'
import {EnforceNonEmptyRecord, StringValueRecord} from '../../record'
import {GroupTwoTables} from './group_two_tables'
import {Value} from '../../value'
import {parseGet} from '../../parsing/selection/get_parsing'
import {parseMap} from '../../parsing/selection/map_parsing'
import {parseGetKey} from '../../parsing/get_key_parsing'
import {parseSelectMultipleTables} from '../../parsing/selection/multi_table_selection_parsing'
import {Table} from '../one/table'
import {Subtable} from '../one/subtable'
import {parseMapS} from '../../parsing/selection/maps_parsing'
import {SelectScalar} from '../selections/select_scalar'
import {SelectRows} from '../selections/select_rows'

export class SortTwoTables<T1, T2> {

    constructor(
        private firstConstructor: Constructor<T1>,
        private secondConstructor: Constructor<T2>,
        private readonly statement: SelectStatement) {}

    thenBy(sortBy: (first: T1, second: T2) => Value): SortTwoTables<T1, T2> {
        return new SortTwoTables(
            this.firstConstructor,
            this.secondConstructor,
            {
                ...this.statement,
                orders: this.statement.orders.concat(parseOrder(sortBy, 'asc'))
            })
    }

    thenDescendinglyBy(sortBy: (first: T1, second: T2) => Value): SortTwoTables<T1, T2> {
        return new SortTwoTables(
            this.firstConstructor,
            this.secondConstructor,
            {
                ...this.statement,
                orders: this.statement.orders.concat(parseOrder(sortBy, 'desc'))
            })
    }

    select<K extends string>(first: string, second: string): SelectRows<{ [first in K]: T1 } & { [second in K]: T2 }> {
        return new SelectRows(
            {
                ...this.statement,
                selection: parseSelectMultipleTables([
                    [first, this.firstConstructor],
                    [second, this.secondConstructor]
                ])
            })
    }

    map<U extends StringValueRecord>(f: (first: T1, second: T2) => EnforceNonEmptyRecord<U> & U): SelectRows<U> {
        return new SelectRows(
            {
                ...this.statement,
                selection: parseMap(f)
            })
    }

    mapS<S, U extends StringValueRecord>(
        tableInSubquery: Table<S>,
        f: (s: Subtable<S>, first: T1, second: T2) => EnforceNonEmptyRecord<U> & U): SelectRows<U> {
        return new SelectRows(
            {
                ...this.statement,
                selection: parseMapS(f, [tableInSubquery.tableName])
            })
    }

    get<U extends Value>(f: (first: T1, second: T2) => U): SelectScalar<U> {
        return new SelectScalar(
            {
                ...this.statement,
                selection: parseGet(f)
            })
    }

    groupBy<K extends StringValueRecord>(getKey: (first: T1, second: T2) => EnforceNonEmptyRecord<K> & K) : GroupTwoTables<T1, T2, K>{
        return new GroupTwoTables<T1, T2, K>(
            {
                ...this.statement,
                key: parseGetKey(getKey)
            })
    }
}