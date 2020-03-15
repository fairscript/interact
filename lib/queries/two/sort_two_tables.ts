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
import {parseGet} from '../../generation/get_parsing'
import {parseMap} from '../../parsing/map_parsing'
import {parseMultiTableSelect} from '../../parsing/select_parsing'
import {parseGetKey} from '../../parsing/get_key_parsing'

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

    select(first: string, second: string): SelectTwoTables {
        return new SelectTwoTables(
            {
                ...this.statement,
                selection: parseMultiTableSelect({
                    [first]: this.firstConstructor,
                    [second]: this.secondConstructor
                })
            })
    }

    get<U extends Value>(f: (first: T1, second: T2) => U): GetColumnFromTwoTables {
        return new GetColumnFromTwoTables(
            {
                ...this.statement,
                selection: [parseGet(f)]
            })
    }

    map<U extends StringValueRecord>(f: (first: T1, second: T2) => EnforceNonEmptyRecord<U> & U): MapTwoTables {
        return new MapTwoTables(
            {
                ...this.statement,
                selection: parseMap(f)
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