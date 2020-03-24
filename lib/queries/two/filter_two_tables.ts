import {Constructor, SelectStatement} from '../../select_statement'
import {SortTwoTables} from './sort_two_tables'
import {GroupTwoTables} from './group_two_tables'
import {EnforceNonEmptyRecord, StringValueRecord, ValueOrNestedStringValueRecord} from '../../record'
import {Value} from '../../value'
import {parseGet} from '../../parsing/selection/get_parsing'
import {parseMap} from '../../parsing/selection/map_parsing'
import {parseOrder} from '../../parsing/order_parsing'
import {parseGetKey} from '../../parsing/get_key_parsing'
import {RowSelectGenerator, ScalarSelectGenerator} from '../select_generators'
import {parseSelectMultipleTables} from '../../parsing/selection/multi_table_selection_parsing'
import {Table} from '../one/table'
import {Subtable} from '../one/subtable'
import {parseMapS} from '../../parsing/selection/maps_parsing'
import {createCountSelection} from '../../parsing/selection/count_parsing'
import {parseParameterlessFilter} from '../../parsing/filtering/parameterless_filter_parsing'
import {parseParameterizedFilter} from '../../parsing/filtering/parameterized_filter_parsing'

export class FilterTwoTables<T1, T2> {
    constructor(
        private readonly firstConstructor: Constructor<T1>,
        private readonly secondConstructor: Constructor<T2>,
        private readonly statement: SelectStatement,
        private readonly filters: number) {}

    filter(predicate: (first: T1, second: T2) => boolean): FilterTwoTables<T1, T2> {
        return new FilterTwoTables(
            this.firstConstructor,
            this.secondConstructor,
            {
                ...this.statement,
                filters: this.statement.filters.concat(parseParameterlessFilter(predicate))
            },
            this.filters+1)
    }

    filterP<P extends ValueOrNestedStringValueRecord>(provided: P, predicate: (parameter: P, first: T1, second: T2) => boolean): FilterTwoTables<T1, T2> {
        return new FilterTwoTables(
            this.firstConstructor,
            this.secondConstructor,
            {
                ...this.statement,
                filters: this.statement.filters.concat(parseParameterizedFilter(predicate, provided, `f${this.filters+1}`))
            },
            this.filters+1)
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

    select<K extends string>(first: string, second: string): RowSelectGenerator<{ [first in K]: T1 } & { [second in K]: T2 }> {
        return new RowSelectGenerator(
            {
                ...this.statement,
                selection: parseSelectMultipleTables([
                    [first, this.firstConstructor ],
                    [second, this.secondConstructor]
                ])
            })
    }

    map<U extends StringValueRecord>(f: (first: T1, second: T2) => EnforceNonEmptyRecord<U> & U): RowSelectGenerator<U> {
        return new RowSelectGenerator(
            {
                ...this.statement,
                selection: parseMap(f)
            })
    }

    mapS<S, U extends StringValueRecord>(
        tableInSubquery: Table<S>,
        f: (s: Subtable<S>, first: T1, second: T2) => EnforceNonEmptyRecord<U> & U): RowSelectGenerator<U> {
        return new RowSelectGenerator(
            {
                ...this.statement,
                selection: parseMapS(f, [tableInSubquery.tableName])
            })
    }

    get<U extends Value>(f: (first: T1, second: T2) => U): ScalarSelectGenerator<U> {
        return new ScalarSelectGenerator(
            {
                ...this.statement,
                selection: parseGet(f)
            })
    }

    count(): ScalarSelectGenerator<number> {
        return new ScalarSelectGenerator(
            {
                ...this.statement,
                selection: createCountSelection()
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