import {FilterTable} from './filter_table'
import {SortTable} from './sort_table'
import {GroupTable} from './group_table'
import {JoinSecondTable} from '../two/join_second_table'
import {EnforceNonEmptyRecord, TableAggregationRecord, ValueOrNestedValueRecord, ValueRecord} from '../../record'
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
import {
    mapTable,
    mapTableWithSubquery,
    SelectRows, selectTable
} from '../selection/select_rows'
import {getColumn, SelectVector} from '../selection/select_vector'
import {AggregatableTable, Count} from '../aggregatable_table'
import {aggregateTables, SelectSingleRow} from '../selection/select_single_row'
import {
    addAscendingOrder, addDescendingOrder,
    addParameterizedFilter,
    addParameterlessFilter,
    Constructor,
    createEmptySelectStatement,
    joinTable,
    SelectStatement
} from '../../statements/select_statement'
import {groupTablesBy} from '../../statements/group_select_statement'


export class Table<T> {
    private readonly statement: SelectStatement

    constructor(
        public constructor: Constructor<T>,
        public tableName: string) {

        this.statement = createEmptySelectStatement(tableName)
    }

    filter(predicate: (table: T) => boolean): FilterTable<T>
    filter<P extends ValueOrNestedValueRecord>(provided: P, predicate: (parameters: P, table: T) => boolean): FilterTable<T>
    filter<P extends ValueOrNestedValueRecord>(predicateOrProvided: ((table: T) => boolean)|P, predicate?: (parameters: P, table: T) => boolean): FilterTable<T> {
        return new FilterTable(
            this.constructor,
            typeof predicateOrProvided === 'function'
                ? addParameterlessFilter(this.statement, predicateOrProvided)
                : addParameterizedFilter(this.statement, predicate!, predicateOrProvided)
        )
    }

    sortBy(sortBy: (table: T) => Value): SortTable<T> {
        return new SortTable(
            this.constructor,
            addAscendingOrder(this.statement, sortBy)
        )
    }

    sortDescendinglyBy(sortBy: (table: T) => Value): SortTable<T> {
        return new SortTable(
            this.constructor,
            addDescendingOrder(this.statement, sortBy)
        )
    }

    join<U, K extends Value>(otherTable: Table<U>, left: (firstTable: T) => K, right: (secondTable: U) => K): JoinSecondTable<T, U> {
        return new JoinSecondTable(
            this.constructor,
            otherTable.constructor,
            joinTable(this.statement, otherTable, left, right))
    }

    select(): SelectRows<T> {
        return selectTable(this.statement, this.constructor)
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

    aggregate<A extends TableAggregationRecord>(
        aggregation: (table: AggregatableTable<T>, count: () => Count) => EnforceNonEmptyRecord<A> & A): SelectSingleRow<A> {
        return aggregateTables(this.statement, aggregation)
    }

    groupBy<K extends ValueRecord>(getKey: (table: T) => EnforceNonEmptyRecord<K> & K): GroupTable<T, K>{
        return new GroupTable(groupTablesBy(this.statement, getKey))
    }
}

export function defineTable<T>(constructor: Constructor<T>, name: string): Table<T> {
    return new Table(constructor, name)
}