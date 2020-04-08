import {EnforceNonEmptyRecord, ValueRecord} from '../../record'
import {Value} from '../../value'
import {Subtable} from '../subtable'
import {Table} from './table'
import {mapTable, mapTableWithSubquery, SelectRows, selectTable} from '../selection/select_rows'
import {getColumn, SelectVector} from '../selection/select_vector'
import {addAscendingOrder, addDescendingOrder, Constructor, SelectStatement} from '../../statements/select_statement'

export type Direction = 'asc' | 'desc'

export class SortTable<T> {

    constructor(
        private readonly constructor: Constructor<T>,
        private readonly statement: SelectStatement) {}

    thenBy(sortBy: (table: T) => Value): SortTable<T> {
        return new SortTable(
            this.constructor,
            addAscendingOrder(this.statement, sortBy)
        )
    }

    thenDescendinglyBy(sortBy: (table: T) => Value): SortTable<T> {
        return new SortTable(
            this.constructor,
            addDescendingOrder(this.statement, sortBy)
        )
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
}