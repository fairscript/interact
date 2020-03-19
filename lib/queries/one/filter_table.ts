import {Constructor, SelectStatement} from '../../select_statement'
import {SortTable} from './sort_table'
import {GroupTable} from './group_table'
import {parseFilter} from '../../parsing/filter_parsing'
import {EnforceNonEmptyRecord, StringValueRecord} from '../../record'
import {Value} from '../../value'
import {parseOrder} from '../../parsing/order_parsing'
import {parseGet} from '../../parsing/selection/get_parsing'
import {parseMap} from '../../parsing/selection/map_parsing'
import {parseGetKey} from '../../parsing/get_key_parsing'
import {SelectSqlGenerator} from '../selection'
import {createCountSelection} from '../../parsing/selection/count_parsing'
import {parseSelectSingleTable} from '../../parsing/selection/single_table_selection_parsing'
import {Subtable} from './subtable'
import {parseMapS} from '../../parsing/selection/maps_parsing'
import {Table} from './table'

export class FilterTable<T> {

    constructor(
        private readonly constructor: Constructor<T>,
        private readonly statement: SelectStatement) {}

    filter(predicate: (table: T) => boolean): FilterTable<T> {
        return new FilterTable(
            this.constructor,
            {
                ...this.statement,
                filters: this.statement.filters.concat(parseFilter(predicate))
            }
        )
    }

    sortBy(sortBy: (table: T) => Value): SortTable<T> {
        return new SortTable(
            {
                ...this.statement,
                orders: this.statement.orders.concat(parseOrder(sortBy, 'asc'))
            })
    }

    sortDescendinglyBy(sortBy: (table: T) => Value): SortTable<T> {
        return new SortTable(
            {
                ...this.statement,
                orders: this.statement.orders.concat(parseOrder(sortBy, 'desc'))
            })
    }

    select(): SelectSqlGenerator<T> {
        return new SelectSqlGenerator(
            {
                ...this.statement,
                selection: parseSelectSingleTable(this.constructor)
            })
    }

    get<U extends Value>(f: (table: T) => U): SelectSqlGenerator<U> {
        return new SelectSqlGenerator(
            {
                ...this.statement,
                selection: parseGet(f)
            })
    }

    count(): SelectSqlGenerator<number> {
        return new SelectSqlGenerator(
            {
                ...this.statement,
                selection: createCountSelection()
            })
    }

    map<U extends StringValueRecord>(f: (table: T) => EnforceNonEmptyRecord<U> & U): SelectSqlGenerator<U> {
        return new SelectSqlGenerator(
            {
                ...this.statement,
                selection: parseMap(f)
            })
    }

    mapS<S, U extends StringValueRecord>(tableInSubquery: Table<S>, f: (s: Subtable<S>, x: T) => EnforceNonEmptyRecord<U> & U): SelectSqlGenerator<U> {
        return new SelectSqlGenerator(
            {
                ...this.statement,
                selection: parseMapS(f, [tableInSubquery.tableName])
            })
    }

    groupBy<K extends StringValueRecord>(getKey: (table: T) => EnforceNonEmptyRecord<K> & K): GroupTable<T, K>{
        return new GroupTable<T, K>(
            {
                ...this.statement,
                key: parseGetKey(getKey)
            })
    }
}