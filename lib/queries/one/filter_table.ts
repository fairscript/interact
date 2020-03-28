import {Constructor, SelectStatement} from '../../select_statement'
import {SortTable} from './sort_table'
import {GroupTable} from './group_table'
import {EnforceNonEmptyRecord, StringValueRecord, ValueOrNestedStringValueRecord} from '../../record'
import {Value} from '../../value'
import {parseOrder} from '../../parsing/order_parsing'
import {parseGet} from '../../parsing/selection/get_parsing'
import {parseMap} from '../../parsing/selection/map_parsing'
import {parseGetKey} from '../../parsing/get_key_parsing'
import {createCountSelection} from '../../parsing/selection/count_parsing'
import {parseSelectSingleTable} from '../../parsing/selection/single_table_selection_parsing'
import {Subtable} from './subtable'
import {parseMapS} from '../../parsing/selection/maps_parsing'
import {Table} from './table'
import {parseParameterlessFilter} from '../../parsing/filtering/parameterless_filter_parsing'
import {parseParameterizedFilter} from '../../parsing/filtering/parameterized_filter_parsing'
import {SelectScalar} from '../selection/select_scalar'
import {SelectRows} from '../selection/select_rows'
import {SelectVector} from '../selection/select_vector'

export class FilterTable<T> {

    constructor(
        private readonly constructor: Constructor<T>,
        private readonly statement: SelectStatement,
        private readonly filters: number) {}

    filter(predicate: (table: T) => boolean): FilterTable<T> {
        return new FilterTable(
            this.constructor,
            {
                ...this.statement,
                filters: this.statement.filters.concat(parseParameterlessFilter(predicate))
            },
            this.filters + 1)
    }

    filterP<P extends ValueOrNestedStringValueRecord>(provided: P, predicate: (parameter: P, table: T) => boolean): FilterTable<T> {
        return new FilterTable(
            this.constructor,
            {
                ...this.statement,
                filters: this.statement.filters.concat(parseParameterizedFilter(predicate, `f${this.filters + 1}`, provided))
            },
            this.filters + 1)
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

    select(): SelectRows<T> {
        return new SelectRows(
            {
                ...this.statement,
                selection: parseSelectSingleTable(this.constructor)
            })
    }

    map<U extends StringValueRecord>(f: (table: T) => EnforceNonEmptyRecord<U> & U): SelectRows<U> {
        return new SelectRows(
            {
                ...this.statement,
                selection: parseMap(f)
            })
    }

    mapS<S, U extends StringValueRecord>(tableInSubquery: Table<S>, f: (s: Subtable<S>, x: T) => EnforceNonEmptyRecord<U> & U): SelectRows<U> {
        return new SelectRows(
            {
                ...this.statement,
                selection: parseMapS(f, [tableInSubquery.tableName])
            })
    }

    get<U extends Value>(f: (table: T) => U): SelectVector<U> {
        return new SelectVector(
            {
                ...this.statement,
                selection: parseGet(f)
            })
    }

    count(): SelectScalar<number> {
        return new SelectScalar(
            {
                ...this.statement,
                selection: createCountSelection()
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