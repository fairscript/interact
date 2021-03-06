import {SortFiveTables} from './sort_five_tables'
import {GroupFiveTables} from './group_five_tables'
import {EnforceNonEmptyRecord, ValueOrNestedValueRecord, ValueRecord} from '../../record'
import {Value} from '../../value'
import {Table} from '../one/table'
import {Subtable} from '../subtable'
import {
    averageColumn,
    countRows,
    maximizeColumn,
    minimizeColumn,
    SelectScalar,
    sumColumn
} from '../selection/select_scalar'
import {mapTable, mapTableWithSubquery, SelectRows} from '../selection/select_rows'
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
import {aggregateTables, SelectGuaranteedSingleRow} from '../selection/select_guaranteed_single_row'
import {selectSetsOfRows, SelectSetsOfRows} from '../selection/select_sets_of_rows'
import {selectExpectedSetOfRows, SelectExpectedSetOfRows} from '../selection/select_expected_set_of_rows'

export class FilterFiveTables<T1, T2, T3, T4, T5> {
    constructor(private readonly statement: SelectStatement) {}

    filter(predicate: (first: T1, second: T2, third: T3, fourth: T4, fifth: T5) => boolean): FilterFiveTables<T1, T2, T3, T4, T5>
    filter<P extends ValueOrNestedValueRecord>(provided: P, predicate: (parameters: P, first: T1, second: T2, third: T3, fourth: T4, fifth: T5) => boolean): FilterFiveTables<T1, T2, T3, T4, T5>
    filter<P extends ValueOrNestedValueRecord>(predicateOrProvided: ((first: T1, second: T2, third: T3, fourth: T4, fifth: T5) => boolean)|P, predicate?: (parameters: P, first: T1, second: T2, third: T3, fourth: T4, fifth: T5) => boolean): FilterFiveTables<T1, T2, T3, T4, T5> {
        return new FilterFiveTables(
            typeof predicateOrProvided === 'function'
                ? addParameterlessFilter(this.statement, predicateOrProvided)
                : addParameterizedFilter(this.statement, predicate!, predicateOrProvided)
        )
    }

    sortBy(sortBy: (first: T1, second: T2, third: T3, fourth: T4, fifth: T5) => Value): SortFiveTables<T1, T2, T3, T4, T5> {
        return new SortFiveTables(
            addAscendingOrder(this.statement, sortBy))
    }

    sortDescendinglyBy(sortBy: (first: T1, second: T2, third: T3, fourth: T4, fifth: T5) => Value): SortFiveTables<T1, T2, T3, T4, T5> {
        return new SortFiveTables(
            addDescendingOrder(this.statement, sortBy))
    }

    select<K extends string>(firstName: string, secondName: string, thirdName: string, fourthName: string, fifthName: string): SelectSetsOfRows<{ [first in K]: T1 } & { [second in K]: T2 } & { [third in K]: T3 } & { [fourth in K]: T4 } & { [fifth in K]: T5 }> {
        return selectSetsOfRows(
            this.statement,
            [
                firstName,
                secondName,
                thirdName,
                fourthName,
                fifthName
            ])
    }

    single<K extends string>(firstName: string, secondName: string, thirdName: string, fourthName: string, fifthName: string): SelectExpectedSetOfRows<{ [first in K]: T1 } & { [second in K]: T2 } & { [third in K]: T3 } & { [fourth in K]: T4 } & { [fifth in K]: T5 }> {
        return selectExpectedSetOfRows(
            this.statement,
            [
                firstName,
                secondName,
                thirdName,
                fourthName,
                fifthName
            ])
    }

    map<U extends ValueRecord>(f: (first: T1, second: T2, third: T3, fourth: T4, fifth: T5) => EnforceNonEmptyRecord<U> & U): SelectRows<U>
    map<S, U extends ValueRecord>(tableInSubquery: Table<S>, f: (s: Subtable<S>, first: T1, second: T2, third: T3, fourth: T4, fifth: T5) => EnforceNonEmptyRecord<U> & U): SelectRows<U>
    map<S, U extends ValueRecord>(fOrTableInSubquery: ((first: T1, second: T2, third: T3, fourth: T4, fifth: T5) => EnforceNonEmptyRecord<U> & U)|Table<S>, f?: (s: Subtable<S>, first: T1, second: T2, third: T3, fourth: T4, fifth: T5) => EnforceNonEmptyRecord<U> & U): SelectRows<U>{
        return typeof fOrTableInSubquery === 'function'
            ? mapTable(this.statement, fOrTableInSubquery)
            : mapTableWithSubquery(this.statement, f!, fOrTableInSubquery)
    }

    get<U extends Value>(f: (first: T1, second: T2, third: T3, fourth: T4, fifth: T5) => U): SelectVector<U> {
        return getColumn(this.statement, f)
    }

    count(): SelectScalar<number> {
        return countRows(this.statement)
    }

    max<V extends Value>(f: (first: T1, second: T2, third: T3, fourth: T4, fifth: T5) => V): SelectScalar<V> {
        return maximizeColumn(this.statement, f)
    }

    min<V extends Value>(f: (first: T1, second: T2, third: T3, fourth: T4, fifth: T5) => V): SelectScalar<V> {
        return minimizeColumn(this.statement, f)
    }

    sum<V extends Value>(f: (first: T1, second: T2, third: T3, fourth: T4, fifth: T5) => V): SelectScalar<V> {
        return sumColumn(this.statement, f)
    }

    average<V extends Value>(f: (first: T1, second: T2, third: T3, fourth: T4, fifth: T5) => V): SelectScalar<V> {
        return averageColumn(this.statement, f)
    }

    aggregate<A extends ValueRecord>(
        aggregation: (first: AggregatableTable<T1>, second: AggregatableTable<T2>, third: AggregatableTable<T3>, fourth: AggregatableTable<T4>, fifth: AggregatableTable<T5>, count: () => number) => EnforceNonEmptyRecord<A> & A): SelectGuaranteedSingleRow<A> {
        return aggregateTables(this.statement, aggregation)
    }

    groupBy<K extends ValueRecord>(getKey: (first: T1, second: T2, third: T3, fourth: T4, fifth: T5) => EnforceNonEmptyRecord<K> & K): GroupFiveTables<T1, T2, T3, T4, T5, K> {
        return new GroupFiveTables(groupTablesBy(this.statement, getKey))
    }
}