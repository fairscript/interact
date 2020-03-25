import {Constructor, createEmptySelectStatement, SelectStatement} from '../../select_statement'
import {FilterTable} from './filter_table'
import {SortTable} from './sort_table'
import {GroupTable} from './group_table'
import {JoinSecondTable} from '../two/join_second_table'
import {EnforceNonEmptyRecord, StringValueRecord, ValueOrNestedStringValueRecord} from '../../record'
import {Value} from '../../value'
import {parseOrder} from '../../parsing/order_parsing'
import {parseGet} from '../../parsing/selection/get_parsing'
import {parseMap} from '../../parsing/selection/map_parsing'
import {parseGetKey} from '../../parsing/get_key_parsing'
import {parseJoin} from '../../parsing/join_parsing'
import {RowSelectGenerator, ScalarSelectGenerator} from '../select_generators'
import {parseMapS} from '../../parsing/selection/maps_parsing'
import {createCountSelection} from '../../parsing/selection/count_parsing'
import {parseSelectSingleTable} from '../../parsing/selection/single_table_selection_parsing'
import {Subtable} from './subtable'
import {parseParameterlessFilter} from '../../parsing/filtering/parameterless_filter_parsing'
import {parseParameterizedFilter} from '../../parsing/filtering/parameterized_filter_parsing'


export class Table<T> {
    private readonly statement: SelectStatement

    constructor(
        protected constructor: Constructor<T>,
        public tableName: string) {

        this.statement = createEmptySelectStatement(tableName)
    }

    filter(predicate: (table: T) => boolean): FilterTable<T> {
        return new FilterTable(
            this.constructor,
            {
                ...this.statement,
                filters: this.statement.filters.concat(parseParameterlessFilter(predicate))
            },
            1
        )
    }

    filterP<P extends ValueOrNestedStringValueRecord>(provided: P, predicate: (parameters: P, table: T) => boolean): FilterTable<T> {
        return new FilterTable(
            this.constructor,
            {
                ...this.statement,
                filters: this.statement.filters.concat(parseParameterizedFilter(predicate, 'f1', provided))
            },
            1
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

    select(): RowSelectGenerator<T> {
        return new RowSelectGenerator(
            {
                ...this.statement,
                selection: parseSelectSingleTable(this.constructor)
            })
    }

    map<U extends StringValueRecord>(map: (table: T) => EnforceNonEmptyRecord<U> & U): RowSelectGenerator<U> {
        return new RowSelectGenerator(
            {
                ...this.statement,
                selection: parseMap(map)
            })
    }

    mapS<S, U extends StringValueRecord>(tableInSubquery: Table<S>, map: (s: Subtable<S>, x: T) => EnforceNonEmptyRecord<U> & U): RowSelectGenerator<U> {
        return new RowSelectGenerator(
            {
                ...this.statement,
                selection: parseMapS(map, [tableInSubquery.tableName])
            })
    }

    get<U extends Value>(f: (table: T) => U): ScalarSelectGenerator<U> {
        return new ScalarSelectGenerator(
            {
                ...this.statement,
                selection: parseGet(f)
            })
    }

    count(): ScalarSelectGenerator<number> {
        return new ScalarSelectGenerator<number>(
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

    join<U, K extends Value>(otherTable: Table<U>, left: (firstTable: T) => K, right: (secondTable: U) => K) {
        return new JoinSecondTable<T, U, K>(
            this.constructor,
            otherTable.constructor,
            {
                ...this.statement,
                join: parseJoin(otherTable.tableName, left, right)
            })
    }
}

export function defineTable<T>(constructor: Constructor<T>, name: string): Table<T> {
    return new Table<T>(constructor, name)
}