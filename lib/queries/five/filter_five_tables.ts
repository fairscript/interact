import {SortFiveTables} from './sort_five_tables'
import {GroupFiveTables} from './group_five_tables'
import {EnforceNonEmptyRecord, TableAggregationRecord, ValueOrNestedValueRecord, ValueRecord} from '../../record'
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
import {mapTable, mapTableWithSubquery, SelectRows, selectTables} from '../selection/select_rows'
import {getColumn, SelectVector} from '../selection/select_vector'
import {AggregatableTable, Count} from '../aggregatable_table'
import {aggregateTables, SelectSingleRow} from '../selection/select_single_row'
import {
    addAscendingOrder,
    addDescendingOrder,
    addParameterizedFilter,
    addParameterlessFilter,
    Constructor,
    SelectStatement
} from '../../statements/select_statement'
import {groupTablesBy} from '../../statements/group_select_statement'

export class FilterFiveTables<T1, T2, T3, T4, T5> {
    constructor(
        private readonly firstConstructor: Constructor<T1>,
        private readonly secondConstructor: Constructor<T2>,
        private readonly thirdConstructor: Constructor<T3>,
        private readonly fourthConstructor: Constructor<T4>,
        private readonly fifthConstructor: Constructor<T5>,
        private readonly statement: SelectStatement) {}

    filter(predicate: (first: T1, second: T2, third: T3, fourth: T4, fifth: T5) => boolean): FilterFiveTables<T1, T2, T3, T4, T5>
    filter<P extends ValueOrNestedValueRecord>(provided: P, predicate: (parameters: P, first: T1, second: T2, third: T3, fourth: T4, fifth: T5) => boolean): FilterFiveTables<T1, T2, T3, T4, T5>
    filter<P extends ValueOrNestedValueRecord>(predicateOrProvided: ((first: T1, second: T2, third: T3, fourth: T4, fifth: T5) => boolean)|P, predicate?: (parameters: P, first: T1, second: T2, third: T3, fourth: T4, fifth: T5) => boolean): FilterFiveTables<T1, T2, T3, T4, T5> {
        return new FilterFiveTables(
            this.firstConstructor,
            this.secondConstructor,
            this.thirdConstructor,
            this.fourthConstructor,
            this.fifthConstructor,
            typeof predicateOrProvided === 'function'
                ? addParameterlessFilter(this.statement, predicateOrProvided)
                : addParameterizedFilter(this.statement, predicate!, predicateOrProvided)
        )
    }

    sortBy(sortBy: (first: T1, second: T2, third: T3, fourth: T4, fifth: T5) => Value): SortFiveTables<T1, T2, T3, T4, T5> {
        return new SortFiveTables(
            this.firstConstructor,
            this.secondConstructor,
            this.thirdConstructor,
            this.fourthConstructor,
            this.fifthConstructor,
            addAscendingOrder(this.statement, sortBy))
    }

    sortDescendinglyBy(sortBy: (first: T1, second: T2, third: T3, fourth: T4, fifth: T5) => Value): SortFiveTables<T1, T2, T3, T4, T5> {
        return new SortFiveTables(
            this.firstConstructor,
            this.secondConstructor,
            this.thirdConstructor,
            this.fourthConstructor,
            this.fifthConstructor,
            addDescendingOrder(this.statement, sortBy))
    }

    select<K extends string>(firstName: string, secondName: string, thirdName: string, fourthName: string, fifthName: string): SelectRows<{ [first in K]: T1 } & { [second in K]: T2 } & { [third in K]: T3 } & { [fourth in K]: T4 } & { [fifth in K]: T5 }> {
        return selectTables(
            this.statement,
            [
                [firstName, this.firstConstructor],
                [secondName, this.secondConstructor],
                [thirdName, this.thirdConstructor],
                [fourthName, this.fourthConstructor],
                [fifthName, this.fifthConstructor]
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

    aggregate<A extends TableAggregationRecord>(
        aggregation: (first: AggregatableTable<T1>, second: AggregatableTable<T2>, third: AggregatableTable<T3>, fourth: AggregatableTable<T4>, fifth: AggregatableTable<T5>, count: () => Count) => EnforceNonEmptyRecord<A> & A): SelectSingleRow<A> {
        return aggregateTables(this.statement, aggregation)
    }

    groupBy<K extends ValueRecord>(getKey: (first: T1, second: T2, third: T3, fourth: T4, fifth: T5) => EnforceNonEmptyRecord<K> & K): GroupFiveTables<T1, T2, T3, T4, T5, K> {
        return new GroupFiveTables(groupTablesBy(this.statement, getKey))
    }
}