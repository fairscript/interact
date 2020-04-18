import {FilterTable} from './filter_table'
import {SortTable} from './sort_table'
import {GroupTable} from './group_table'
import {JoinSecondTable} from '../two/join_second_table'
import {
    EnforceNonEmptyRecord,
    ValueOrNestedValueRecord,
    ValueRecord
} from '../../record'
import {Value} from '../../value'
import {Subtable} from '../subtable'
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
    createEmptySelectStatement,
    joinTable,
    SelectStatement
} from '../../statements/select_statement'
import {groupTablesBy} from '../../statements/group_select_statement'
import {aggregateTables, SelectGuaranteedSingleRow} from '../selection/select_guaranteed_single_row'

export type ColumnType = 'string' | 'integer' | 'float' | 'boolean'

export type Columns<T> = {
    [P in keyof T]: ColumnType
}

export class Table<T> {
    private readonly statement: SelectStatement

    constructor(
        public readonly tableName: string,
        public readonly columns: Columns<T>) {

        this.statement = createEmptySelectStatement(tableName, columns)
    }

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
            addAscendingOrder(this.statement, sortBy)
        )
    }

    sortDescendinglyBy(sortBy: (table: T) => Value): SortTable<T> {
        return new SortTable(
            addDescendingOrder(this.statement, sortBy)
        )
    }

    join<U, K extends Value>(otherTable: Table<U>, left: (firstTable: T) => K, right: (secondTable: U) => K): JoinSecondTable<T, U> {
        return new JoinSecondTable(
            joinTable(this.statement, otherTable, left, right))
    }

    select(): SelectRows<T> {
        return selectTable(this.statement)
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
        return new GroupTable(groupTablesBy(this.statement, getKey))
    }
}

export function defineTable<T>(tableName: string, columns: Columns<T>): Table<T> {
    return new Table(tableName, columns)
}