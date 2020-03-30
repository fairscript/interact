import {Constructor, createGroupSelectStatement, SelectStatement} from '../../select_statement'
import {SortTable} from './sort_table'
import {GroupTable} from './group_table'
import {EnforceNonEmptyRecord, StringValueRecord, ValueOrNestedStringValueRecord} from '../../record'
import {Value} from '../../value'
import {parseSorting} from '../../parsing/sorting/sorting_parsing'
import {parseGetSelection} from '../../parsing/selection/get_selection_parsing'
import {parseMapSelection} from '../../parsing/selection/map_selection_parsing'
import {parseGetKey} from '../../parsing/get_key_parsing'
import {createCountSelection} from '../../parsing/selection/count_selection'
import {parseSingleTableSelection} from '../../parsing/selection/single_table_selection_parsing'
import {Subtable} from './subtable'
import {parseMapWithSubquerySelection} from '../../parsing/selection/maps_selection_parsing'
import {Table} from './table'
import {parseParameterlessFilter} from '../../parsing/filtering/parameterless_filter_parsing'
import {parseParameterizedFilter} from '../../parsing/filtering/parameterized_filter_parsing'
import {SelectScalar} from '../selection/select_scalar'
import {SelectRows} from '../selection/select_rows'
import {SelectVector} from '../selection/select_vector'
import {
    parseAverageSelection,
    parseMaxSelection,
    parseMinSelection, parseSumSelection
} from '../../parsing/selection/aggregate_column_select_parsing'

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
                orders: this.statement.orders.concat(parseSorting(sortBy, 'asc'))
            })
    }

    sortDescendinglyBy(sortBy: (table: T) => Value): SortTable<T> {
        return new SortTable(
            {
                ...this.statement,
                orders: this.statement.orders.concat(parseSorting(sortBy, 'desc'))
            })
    }

    select(): SelectRows<T> {
        return new SelectRows(
            {
                ...this.statement,
                selection: parseSingleTableSelection(this.constructor)
            })
    }

    map<U extends StringValueRecord>(f: (table: T) => EnforceNonEmptyRecord<U> & U): SelectRows<U> {
        return new SelectRows(
            {
                ...this.statement,
                selection: parseMapSelection(f)
            })
    }

    mapS<S, U extends StringValueRecord>(tableInSubquery: Table<S>, f: (s: Subtable<S>, x: T) => EnforceNonEmptyRecord<U> & U): SelectRows<U> {
        return new SelectRows(
            {
                ...this.statement,
                selection: parseMapWithSubquerySelection(f, [tableInSubquery.tableName])
            })
    }

    get<U extends Value>(f: (table: T) => U): SelectVector<U> {
        return new SelectVector(
            {
                ...this.statement,
                selection: parseGetSelection(f)
            })
    }

    count(): SelectScalar<number> {
        return new SelectScalar(
            {
                ...this.statement,
                selection: createCountSelection()
            })
    }

    max<V extends Value>(f: (table: T) => V): SelectScalar<V> {
        return new SelectScalar(
            {
                ...this.statement,
                selection: parseMaxSelection(f)
            })
    }

    min<V extends Value>(f: (table: T) => V): SelectScalar<V> {
        return new SelectScalar(
            {
                ...this.statement,
                selection: parseMinSelection(f)
            })
    }

    average<V extends Value>(f: (table: T) => V): SelectScalar<V> {
        return new SelectScalar(
            {
                ...this.statement,
                selection: parseAverageSelection(f)
            })
    }

    sum<V extends Value>(f: (table: T) => V): SelectScalar<V> {
        return new SelectScalar(
            {
                ...this.statement,
                selection: parseSumSelection(f)
            })
    }

    groupBy<K extends StringValueRecord>(getKey: (table: T) => EnforceNonEmptyRecord<K> & K): GroupTable<T, K>{
        return new GroupTable<T, K>(
            createGroupSelectStatement(this.statement, parseGetKey(getKey))
        )
    }
}