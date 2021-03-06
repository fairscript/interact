import {SortTable} from './sort_table'
import {GroupTable} from './group_table'
import {EnforceNonEmptyRecord, ValueOrNestedValueRecord, ValueRecord} from '../../record'
import {Value} from '../../value'
import {Subtable} from '../subtable'
import {Table} from './table'
import {
    averageColumn,
    countRows,
    maximizeColumn,
    minimizeColumn,
    SelectScalar,
    sumColumn
} from '../selection/select_scalar'
import {mapTable, mapTableWithSubquery, SelectRows, selectTable} from '../selection/select_rows'
import {getColumn, SelectVector} from '../selection/select_vector'
import {AggregatableTable} from '../aggregatable_table'
import {
    addAscendingOrder,
    addDescendingOrder,
    addParameterizedFilter,
    addParameterlessFilter,
    SelectStatement
} from '../../statements/select_statement'
import {groupTablesBy} from '../../statements/group_select_statement'
import {SelectExpectedSingleRow, selectExpectedSingleRow} from '../selection/select_expected_single_row'
import {aggregateTables, SelectGuaranteedSingleRow} from '../selection/select_guaranteed_single_row'

export class FilterTable<T> {

    constructor(
        private readonly statement: SelectStatement) {}

    filter(predicate: (table: T) => boolean): FilterTable<T>
    filter<P extends ValueOrNestedValueRecord>(provided: P, predicate: (parameters: P, table: T) => boolean): FilterTable<T>
    filter<P extends ValueOrNestedValueRecord>(predicateOrProvided: ((table: T) => boolean)|P, predicate?: (parameters: P, table: T) => boolean): FilterTable<T> {
        return new FilterTable(
            typeof predicateOrProvided === 'function'
                ? addParameterlessFilter(this.statement, predicateOrProvided)
                : addParameterizedFilter(this.statement, predicate!, predicateOrProvided)
        )
    }

    sortBy(sortBy: (table: T) => Value): SortTable<T> {
        return new SortTable(
            addAscendingOrder(this.statement, sortBy))
    }

    sortDescendinglyBy(sortBy: (table: T) => Value): SortTable<T> {
        return new SortTable(
            addDescendingOrder(this.statement, sortBy))
    }

    select(): SelectRows<T> {
        return selectTable(this.statement)
    }

    single(): SelectExpectedSingleRow<T> {
        return selectExpectedSingleRow(this.statement)
    }

    map<U extends ValueRecord>(f: (table: T) => EnforceNonEmptyRecord<U> & U): SelectRows<U>
    map<S, U extends ValueRecord>(tableInSubquery: Table<S>, f: (s: Subtable<S>, x: T) => EnforceNonEmptyRecord<U> & U): SelectRows<U>
    map<S, U extends ValueRecord>(fOrTableInSubquery: ((table: T) => EnforceNonEmptyRecord<U> & U)|Table<S>, f?: (s: Subtable<S>, x: T) => EnforceNonEmptyRecord<U> & U): SelectRows<U>{
        return typeof fOrTableInSubquery === 'function'
            ? mapTable(this.statement, fOrTableInSubquery)
            : mapTableWithSubquery(this.statement, f!, fOrTableInSubquery)
    }

    get<U extends Value>(f: (table: T) => U): SelectVector<U> {
        return getColumn(this.statement, f)
    }

    count(): SelectScalar<number> {
        return countRows(this.statement)
    }

    max<V extends Value>(f: (table: T) => V): SelectScalar<V> {
        return maximizeColumn(this.statement, f)
    }

    min<V extends Value>(f: (table: T) => V): SelectScalar<V> {
        return minimizeColumn(this.statement, f)
    }

    sum<V extends Value>(f: (table: T) => V): SelectScalar<V> {
        return sumColumn(this.statement, f)
    }

    average<V extends Value>(f: (table: T) => V): SelectScalar<V> {
        return averageColumn(this.statement, f)
    }

    aggregate<A extends ValueRecord>(
        aggregation: (table: AggregatableTable<T>, count: () => number) => EnforceNonEmptyRecord<A> & A): SelectGuaranteedSingleRow<A> {
        return aggregateTables(this.statement, aggregation)
    }

    groupBy<K extends ValueRecord>(getKey: (table: T) => EnforceNonEmptyRecord<K> & K): GroupTable<T, K>{
        return new GroupTable<T, K>(groupTablesBy(this.statement, getKey))
    }
}