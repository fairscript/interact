import {
    Constructor,
    createEmptySelectStatement,
    createGroupSelectStatement,
    SelectStatement
} from '../../select_statement'
import {FilterTable} from './filter_table'
import {SortTable} from './sort_table'
import {GroupTable} from './group_table'
import {JoinSecondTable} from '../two/join_second_table'
import {EnforceNonEmptyRecord, TableAggregationRecord, ValueOrNestedValueRecord, ValueRecord} from '../../record'
import {Value} from '../../value'
import {parseSorting} from '../../parsing/sorting/sorting_parsing'
import {parseGetSelection} from '../../parsing/selection/get_selection_parsing'
import {parseMapSelection} from '../../parsing/selection/map_selection_parsing'
import {parseGetKey} from '../../parsing/get_key_parsing'
import {parseJoin} from '../../parsing/join_parsing'
import {parseMapWithSubquerySelection} from '../../parsing/selection/maps_selection_parsing'
import {createCountSelection} from '../../parsing/selection/count_selection'
import {parseSingleTableSelection} from '../../parsing/selection/single_table_selection_parsing'
import {Subtable} from './subtable'
import {parseParameterlessFilter} from '../../parsing/filtering/parameterless_filter_parsing'
import {parseParameterizedFilter} from '../../parsing/filtering/parameterized_filter_parsing'
import {SelectScalar} from '../selection/select_scalar'
import {SelectRows} from '../selection/select_rows'
import {SelectVector} from '../selection/select_vector'
import {
    parseAverageSelection,
    parseMaxSelection,
    parseMinSelection,
    parseSumSelection
} from '../../parsing/selection/aggregate_column_select_parsing'
import {AggregatableTable, Count} from './aggregatable_table'
import {parseTableAggregationSelection} from '../../parsing/selection/table_aggregation_selection_parsing'
import {SelectSingleRow} from '../selection/select_single_row'


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

    filterP<P extends ValueOrNestedValueRecord>(provided: P, predicate: (parameters: P, table: T) => boolean): FilterTable<T> {
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

    map<U extends ValueRecord>(map: (table: T) => EnforceNonEmptyRecord<U> & U): SelectRows<U> {
        return new SelectRows(
            {
                ...this.statement,
                selection: parseMapSelection(map)
            })
    }

    mapS<S, U extends ValueRecord>(tableInSubquery: Table<S>, map: (s: Subtable<S>, x: T) => EnforceNonEmptyRecord<U> & U): SelectRows<U> {
        return new SelectRows(
            {
                ...this.statement,
                selection: parseMapWithSubquerySelection(map, [tableInSubquery.tableName])
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

    groupBy<K extends ValueRecord>(getKey: (table: T) => EnforceNonEmptyRecord<K> & K): GroupTable<T, K>{
        return new GroupTable<T, K>(
            createGroupSelectStatement(this.statement, parseGetKey(getKey))
        )
    }

    aggregate<A extends TableAggregationRecord>(
        aggregation: (table: AggregatableTable<T>, count: () => Count) => EnforceNonEmptyRecord<A> & A): SelectSingleRow<A> {

        return new SelectSingleRow(
            {
                ...this.statement,
                selection: parseTableAggregationSelection(aggregation, 1)
            })
    }

    join<U, K extends Value>(otherTable: Table<U>, left: (firstTable: T) => K, right: (secondTable: U) => K) {
        return new JoinSecondTable<T, U>(
            this.constructor,
            otherTable.constructor,
            {
                ...this.statement,
                join: parseJoin(otherTable.tableName, left, right)
            })
    }
}

export function defineTable<T>(constructor: Constructor<T>, name: string): Table<T> {
    return new Table(constructor, name)
}