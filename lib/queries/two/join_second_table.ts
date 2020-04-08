import {SortTwoTables} from './sort_two_tables'
import {FilterTwoTables} from './filter_two_tables'
import {GroupTwoTables} from './group_two_tables'
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
    Constructor,
    SelectStatement
} from '../../statements/select_statement'
import {groupTablesBy} from '../../statements/group_select_statement'

export class JoinSecondTable<T1, T2> {

    constructor(
        private readonly firstConstructor: Constructor<T1>,
        private readonly secondConstructor: Constructor<T2>,
        private readonly statement: SelectStatement) {}

    filter(predicate: (first: T1, second: T2) => boolean): FilterTwoTables<T1, T2>
    filter<P extends ValueOrNestedValueRecord>(provided: P, predicate: (parameters: P, first: T1, second: T2) => boolean): FilterTwoTables<T1, T2>
    filter<P extends ValueOrNestedValueRecord>(predicateOrProvided: ((first: T1, second: T2) => boolean)|P, predicate?: (parameters: P, first: T1, second: T2) => boolean): FilterTwoTables<T1, T2> {
        return new FilterTwoTables(
            this.firstConstructor,
            this.secondConstructor,
            typeof predicateOrProvided === 'function'
                ? addParameterlessFilter(this.statement, predicateOrProvided)
                : addParameterizedFilter(this.statement, predicate!, predicateOrProvided),
        )
    }

    sortBy(sortBy: (first: T1, second: T2) => Value): SortTwoTables<T1, T2> {
        return new SortTwoTables(
            this.firstConstructor,
            this.secondConstructor,
            addAscendingOrder(this.statement, sortBy))
    }

    sortDescendinglyBy(sortBy: (first: T1, second: T2) => Value): SortTwoTables<T1, T2> {
        return new SortTwoTables(
            this.firstConstructor,
            this.secondConstructor,
            addDescendingOrder(this.statement, sortBy))
    }

    select<K extends string>(firstName: string, secondName: string): SelectRows<{ [first in K]: T1 } & { [second in K]: T2 }> {
        return selectTables(
            this.statement,
            [
                [firstName, this.firstConstructor],
                [secondName, this.secondConstructor]
            ])
    }

    map<U extends ValueRecord>(f: (first: T1, second: T2) => EnforceNonEmptyRecord<U> & U): SelectRows<U>
    map<S, U extends ValueRecord>(tableInSubquery: Table<S>, f: (s: Subtable<S>, first: T1, second: T2) => EnforceNonEmptyRecord<U> & U): SelectRows<U>
    map<S, U extends ValueRecord>(fOrTableInSubquery: ((first: T1, second: T2) => EnforceNonEmptyRecord<U> & U)|Table<S>, f?: (s: Subtable<S>, first: T1, second: T2) => EnforceNonEmptyRecord<U> & U): SelectRows<U>{
        return typeof fOrTableInSubquery === 'function'
            ? mapTable(this.statement, fOrTableInSubquery)
            : mapTableWithSubquery(this.statement, f!, fOrTableInSubquery)
    }

    get<U extends Value>(f: (first: T1, second: T2) => U): SelectVector<U> {
        return getColumn(this.statement, f)
    }

    count(): SelectScalar<number> {
        return countRows(this.statement)
    }

    max<V extends Value>(f: (first: T1, second: T2) => V): SelectScalar<V> {
        return maximizeColumn(this.statement, f)
    }

    min<V extends Value>(f: (first: T1, second: T2) => V): SelectScalar<V> {
        return minimizeColumn(this.statement, f)
    }

    sum<V extends Value>(f: (first: T1, second: T2) => V): SelectScalar<V> {
        return sumColumn(this.statement, f)
    }

    average<V extends Value>(f: (first: T1, second: T2) => V): SelectScalar<V> {
        return averageColumn(this.statement, f)
    }

    aggregate<A extends TableAggregationRecord>(
        aggregation: (first: T1, second: T2, count: () => Count) => EnforceNonEmptyRecord<A> & A): SelectSingleRow<A> {
        return aggregateTables(this.statement, aggregation)
    }

    groupBy<K extends ValueRecord>(getKey: (first: T1, second: T2) => EnforceNonEmptyRecord<K> & K) : GroupTwoTables<T1, T2, K>{
        return new GroupTwoTables<T1, T2, K>(groupTablesBy(this.statement, getKey))
    }
}

