import {EnforceNonEmptyRecord, ValueRecord} from '../../record'
import {Value} from '../../value'
import {Table} from '../one/table'
import {Subtable} from '../subtable'
import {mapTable, mapTableWithSubquery, SelectRows} from '../selection/select_rows'
import {getColumn, SelectVector} from '../selection/select_vector'
import {addAscendingOrder, addDescendingOrder, SelectStatement} from '../../statements/select_statement'
import {selectSetsOfRows, SelectSetsOfRows} from '../selection/select_sets_of_rows'

export class SortTwoTables<T1, T2> {

    constructor(
        private readonly statement: SelectStatement) {}

    thenBy(sortBy: (first: T1, second: T2) => Value): SortTwoTables<T1, T2> {
        return new SortTwoTables(
            addAscendingOrder(this.statement, sortBy))
    }

    thenDescendinglyBy(sortBy: (first: T1, second: T2) => Value): SortTwoTables<T1, T2> {
        return new SortTwoTables(
            addDescendingOrder(this.statement, sortBy))
    }

    select<K extends string>(firstName: string, secondName: string): SelectSetsOfRows<{ [first in K]: T1 } & { [second in K]: T2 }> {
        return selectSetsOfRows(
            this.statement,
            [
                firstName,
                secondName
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

}