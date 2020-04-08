import {SortTwoTables} from './sort_two_tables'
import {GroupTwoTables} from './group_two_tables'
import {EnforceNonEmptyRecord, ValueRecord, ValueOrNestedValueRecord, TableAggregationRecord} from '../../record'
import {Value} from '../../value'
import {parseGetSelection} from '../../parsing/selection/get_selection_parsing'
import {parseMapSelection} from '../../parsing/selection/map_selection_parsing'
import {parseSorting} from '../../parsing/sorting/sorting_parsing'
import {parseGetKey} from '../../parsing/get_key_parsing'
import {parseMultipleTableSelection} from '../../parsing/selection/multi_table_selection_parsing'
import {Table} from '../one/table'
import {Subtable} from '../one/subtable'
import {parseMapWithSubquerySelection} from '../../parsing/selection/maps_selection_parsing'
import {createCountSelection} from '../../parsing/selection/count_selection'
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
import {Count} from '../one/aggregatable_table'
import {SelectSingleRow} from '../selection/select_single_row'
import {parseTableAggregationSelection} from '../../parsing/selection/table_aggregation_selection_parsing'
import {Constructor, SelectStatement} from '../../statements/select_statement'
import {createEmptyGroupSelectStatement} from '../../statements/group_select_statement'

export class FilterTwoTables<T1, T2> {
    constructor(
        private readonly firstConstructor: Constructor<T1>,
        private readonly secondConstructor: Constructor<T2>,
        private readonly statement: SelectStatement,
        private readonly filters: number) {}

    filter(predicate: (first: T1, second: T2) => boolean): FilterTwoTables<T1, T2>
    filter<P extends ValueOrNestedValueRecord>(provided: P, predicate: (parameters: P, first: T1, second: T2) => boolean): FilterTwoTables<T1, T2>
    filter<P extends ValueOrNestedValueRecord>(predicateOrProvided: ((first: T1, second: T2) => boolean)|P, predicate?: (parameters: P, first: T1, second: T2) => boolean): FilterTwoTables<T1, T2> {

        const additionalFilter = typeof predicateOrProvided === 'function'
            ? parseParameterlessFilter(predicateOrProvided)
            : parseParameterizedFilter(predicate!, `f${this.filters + 1}`, predicateOrProvided)

        return new FilterTwoTables(
            this.firstConstructor,
            this.secondConstructor,
            {
                ...this.statement,
                filters: this.statement.filters.concat(additionalFilter)
            },
            this.filters+1)
    }

    sortBy(sortBy: (first: T1, second: T2) => Value): SortTwoTables<T1, T2> {
        return new SortTwoTables(
            this.firstConstructor,
            this.secondConstructor,
            {
                ...this.statement,
                orders: this.statement.orders.concat(parseSorting(sortBy, 'asc'))
            })
    }

    sortDescendinglyBy(sortBy: (first: T1, second: T2) => Value): SortTwoTables<T1, T2> {
        return new SortTwoTables(
            this.firstConstructor,
            this.secondConstructor,
            {
                ...this.statement,
                orders: this.statement.orders.concat(parseSorting(sortBy, 'desc'))
            })
    }

    select<K extends string>(first: string, second: string): SelectRows<{ [first in K]: T1 } & { [second in K]: T2 }> {
        return new SelectRows(
            {
                ...this.statement,
                selection: parseMultipleTableSelection([
                    [first, this.firstConstructor ],
                    [second, this.secondConstructor]
                ])
            })
    }

    map<U extends ValueRecord>(f: (first: T1, second: T2) => EnforceNonEmptyRecord<U> & U): SelectRows<U>
    map<S, U extends ValueRecord>(tableInSubquery: Table<S>, f: (s: Subtable<S>, first: T1, second: T2) => EnforceNonEmptyRecord<U> & U): SelectRows<U>
    map<S, U extends ValueRecord>(fOrTableInSubquery: ((first: T1, second: T2) => EnforceNonEmptyRecord<U> & U)|Table<S>, f?: (s: Subtable<S>, first: T1, second: T2) => EnforceNonEmptyRecord<U> & U): SelectRows<U>{
        const selection = typeof fOrTableInSubquery === 'function'
            ? parseMapSelection(fOrTableInSubquery)
            : parseMapWithSubquerySelection(f!, [fOrTableInSubquery.tableName])

        return new SelectRows(
            {
                ...this.statement,
                selection
            })
    }

    get<U extends Value>(f: (first: T1, second: T2) => U): SelectVector<U> {
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

    max<V extends Value>(f: (first: T1, second: T2) => V): SelectScalar<V> {
        return new SelectScalar(
            {
                ...this.statement,
                selection: parseMaxSelection(f)
            })
    }

    min<V extends Value>(f: (first: T1, second: T2) => V): SelectScalar<V> {
        return new SelectScalar(
            {
                ...this.statement,
                selection: parseMinSelection(f)
            })
    }

    average<V extends Value>(f: (first: T1, second: T2) => V): SelectScalar<V> {
        return new SelectScalar(
            {
                ...this.statement,
                selection: parseAverageSelection(f)
            })
    }

    sum<V extends Value>(f: (first: T1, second: T2) => V): SelectScalar<V> {
        return new SelectScalar(
            {
                ...this.statement,
                selection: parseSumSelection(f)
            })
    }

    aggregate<A extends TableAggregationRecord>(
        aggregation: (first: T1, second: T2, count: () => Count) => EnforceNonEmptyRecord<A> & A): SelectSingleRow<A> {

        return new SelectSingleRow(
            {
                ...this.statement,
                selection: parseTableAggregationSelection(aggregation, 2)
            })
    }

    groupBy<K extends ValueRecord>(getKey: (first: T1, second: T2) => EnforceNonEmptyRecord<K> & K) : GroupTwoTables<T1, T2, K>{
        const {tableName, filters, join} = this.statement

        return new GroupTwoTables<T1, T2, K>({
            ...createEmptyGroupSelectStatement(tableName, parseGetKey(getKey)),
            filters,
            join
        })
    }
}