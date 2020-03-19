import {Constructor, SelectStatement} from '../../select_statement'
import {SortTwoTables} from './sort_two_tables'
import {FilterTwoTables} from './filter_two_tables'
import {GroupTwoTables} from './group_two_tables'
import {EnforceNonEmptyRecord, StringValueRecord} from '../../record'
import {Value} from '../../value'
import {parseGet} from '../../parsing/selection/get_parsing'
import {parseMap} from '../../parsing/selection/map_parsing'
import {parseOrder} from '../../parsing/order_parsing'
import {parseFilter} from '../../parsing/filter_parsing'
import {parseGetKey} from '../../parsing/get_key_parsing'
import {SelectSqlGenerator} from '../selection'
import {parseSelectMultipleTables} from '../../parsing/selection/multi_table_selection_parsing'

export class JoinSecondTable<T1, T2, K1> {

    constructor(
        private readonly firstConstructor: Constructor<T1>,
        private readonly secondConstructor: Constructor<T2>,
        private readonly statement: SelectStatement) {}

    filter(predicate: (first: T1, second: T2) => boolean): FilterTwoTables<T1, T2> {
        return new FilterTwoTables(
            this.firstConstructor,
            this.secondConstructor,
            {
                ...this.statement,
                filters: this.statement.filters.concat(parseFilter(predicate))
            })
    }

    sortBy(sortBy: (first: T1, second: T2) => Value): SortTwoTables<T1, T2> {
        return new SortTwoTables(
            this.firstConstructor,
            this.secondConstructor,
            {
                ...this.statement,
                orders: this.statement.orders.concat(parseOrder(sortBy, 'asc'))
            })
    }

    sortDescendinglyBy(sortBy: (first: T1, second: T2) => Value): SortTwoTables<T1, T2> {
        return new SortTwoTables(
            this.firstConstructor,
            this.secondConstructor,
            {
                ...this.statement,
                orders: this.statement.orders.concat(parseOrder(sortBy, 'desc'))
            })
    }

    select<K extends string>(first: string, second: string): SelectSqlGenerator<{ [first in K]: T1 } & { [second in K]: T2 }> {
        return new SelectSqlGenerator(
            {
                ...this.statement,
                selection: parseSelectMultipleTables([
                    [first, this.firstConstructor],
                    [second, this.secondConstructor]
                ])
            })
    }

    get<U extends Value>(f: (first: T1, second: T2) => U): SelectSqlGenerator<U> {
        return new SelectSqlGenerator(
            {
                ...this.statement,
                selection: parseGet(f)
            })
    }

    map<U extends StringValueRecord>(f: (first: T1, second: T2) => EnforceNonEmptyRecord<U> & U): SelectSqlGenerator<U> {
        return new SelectSqlGenerator(
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

