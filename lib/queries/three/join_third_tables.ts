import {SortThreeTables} from './sort_three_tables'
import {FilterThreeTables} from './filter_three_tables'
import {GroupThreeTables} from './group_three_tables'
import {EnforceNonEmptyRecord, TableAggregationRecord, ValueOrNestedValueRecord, ValueRecord} from '../../record'
import {Value} from '../../value'
import {Subtable} from '../subtable'
import {Table} from '../one/table'
import {
    averageColumn,
    countRows,
    maximizeColumn,
    minimizeColumn,
    SelectScalar,
    sumColumn
} from '../selection/select_scalar'
import {mapTable, mapTableWithSubquery, SelectRows, selectTables} from '../selection/select_rows'
import {getColumn, SelectVector} from '../selection/select_vector'
import {Count} from '../aggregatable_table'
import {aggregateTables, SelectSingleRow} from '../selection/select_single_row'
import {
    addAscendingOrder,
    addDescendingOrder,
    addParameterizedFilter,
    addParameterlessFilter,
    Constructor, joinTable,
    SelectStatement
} from '../../statements/select_statement'
import {groupTablesBy} from '../../statements/group_select_statement'
import {JoinFourthTable} from '../four/join_four_tables'

export class JoinThirdTable<T1, T2, T3> {

    constructor(
        private readonly firstConstructor: Constructor<T1>,
        private readonly secondConstructor: Constructor<T2>,
        private readonly thirdConstructor: Constructor<T3>,
        private readonly statement: SelectStatement) {}

    filter(predicate: (first: T1, second: T2, third: T3) => boolean): FilterThreeTables<T1, T2, T3>
    filter<P extends ValueOrNestedValueRecord>(provided: P, predicate: (parameters: P, first: T1, second: T2, third: T3) => boolean): FilterThreeTables<T1, T2, T3>
    filter<P extends ValueOrNestedValueRecord>(predicateOrProvided: ((first: T1, second: T2, third: T3) => boolean)|P, predicate?: (parameters: P, first: T1, second: T2, third: T3) => boolean): FilterThreeTables<T1, T2, T3> {
        return new FilterThreeTables(
            this.firstConstructor,
            this.secondConstructor,
            this.thirdConstructor,
            typeof predicateOrProvided === 'function'
                ? addParameterlessFilter(this.statement, predicateOrProvided)
                : addParameterizedFilter(this.statement, predicate!, predicateOrProvided),
        )
    }

    sortBy(sortBy: (first: T1, second: T2, third: T3) => Value): SortThreeTables<T1, T2, T3> {
        return new SortThreeTables(
            this.firstConstructor,
            this.secondConstructor,
            this.thirdConstructor,
            addAscendingOrder(this.statement, sortBy))
    }

    sortDescendinglyBy(sortBy: (first: T1, second: T2, third: T3) => Value): SortThreeTables<T1, T2, T3> {
        return new SortThreeTables(
            this.firstConstructor,
            this.secondConstructor,
            this.thirdConstructor,
            addDescendingOrder(this.statement, sortBy))
    }

    join<U, K extends Value>(otherTable: Table<U>, left: (firstTable: T1, secondTable: T2, thirdTable: T3) => K, right: (thirdTable: U) => K): JoinFourthTable<T1, T2, T3, U> {
        return new JoinFourthTable(
            this.firstConstructor,
            this.secondConstructor,
            this.thirdConstructor,
            otherTable.constructor,
            joinTable(this.statement, otherTable, left, right))
    }

    select<K extends string>(firstName: string, secondName: string, thirdName: string): SelectRows<{ [first in K]: T1 } & { [second in K]: T2 } & { [third in K]: T3 }> {
        return selectTables(
            this.statement,
            [
                [firstName, this.firstConstructor],
                [secondName, this.secondConstructor],
                [thirdName, this.thirdConstructor]
            ])
    }

    map<U extends ValueRecord>(f: (first: T1, second: T2, third: T3) => EnforceNonEmptyRecord<U> & U): SelectRows<U>
    map<S, U extends ValueRecord>(tableInSubquery: Table<S>, f: (s: Subtable<S>, first: T1, second: T2, third: T3) => EnforceNonEmptyRecord<U> & U): SelectRows<U>
    map<S, U extends ValueRecord>(fOrTableInSubquery: ((first: T1, second: T2, third: T3) => EnforceNonEmptyRecord<U> & U)|Table<S>, f?: (s: Subtable<S>, first: T1, second: T2, third: T3) => EnforceNonEmptyRecord<U> & U): SelectRows<U>{
        return typeof fOrTableInSubquery === 'function'
            ? mapTable(this.statement, fOrTableInSubquery)
            : mapTableWithSubquery(this.statement, f!, fOrTableInSubquery)
    }

    get<U extends Value>(f: (first: T1, second: T2, third: T3) => U): SelectVector<U> {
        return getColumn(this.statement, f)
    }

    count(): SelectScalar<number> {
        return countRows(this.statement)
    }

    max<V extends Value>(f: (first: T1, second: T2, third: T3) => V): SelectScalar<V> {
        return maximizeColumn(this.statement, f)
    }

    min<V extends Value>(f: (first: T1, second: T2, third: T3) => V): SelectScalar<V> {
        return minimizeColumn(this.statement, f)
    }

    sum<V extends Value>(f: (first: T1, second: T2, third: T3) => V): SelectScalar<V> {
        return sumColumn(this.statement, f)
    }

    average<V extends Value>(f: (first: T1, second: T2, third: T3) => V): SelectScalar<V> {
        return averageColumn(this.statement, f)
    }

    aggregate<A extends TableAggregationRecord>(
        aggregation: (first: T1, second: T2, third: T3, count: () => Count) => EnforceNonEmptyRecord<A> & A): SelectSingleRow<A> {
        return aggregateTables(this.statement, aggregation)
    }

    groupBy<K extends ValueRecord>(getKey: (first: T1, second: T2, third: T3) => EnforceNonEmptyRecord<K> & K) : GroupThreeTables<T1, T2, T3, K>{
        return new GroupThreeTables(groupTablesBy(this.statement, getKey))
    }
}

