import {EnforceNonEmptyRecord, ValueOrNestedValueRecord, ValueRecord} from '../../record'
import {Value} from '../../value'
import {Subtable} from '../subtable'
import {Columns, Table} from './table'
import {mapTable, mapTableWithSubquery, SelectRows, selectTable} from '../selection/select_rows'
import {getColumn, SelectVector} from '../selection/select_vector'
import {
    addAscendingOrder,
    addDescendingOrder, addParameterizedFilter,
    addParameterlessFilter,
    Constructor,
    SelectStatement
} from '../../statements/select_statement'

export type Direction = 'asc' | 'desc'

export class SortTable<T> {

    constructor(
        private readonly typeConstructor: Constructor<T>,
        private readonly statement: SelectStatement) {}

    filter(predicate: (table: T) => boolean): SortTable<T>
    filter<P extends ValueOrNestedValueRecord>(provided: P, predicate: (parameters: P, table: T) => boolean): SortTable<T>
    filter<P extends ValueOrNestedValueRecord>(predicateOrProvided: ((table: T) => boolean)|P, predicate?: (parameters: P, table: T) => boolean): SortTable<T> {
        return new SortTable(
            this.typeConstructor,
            typeof predicateOrProvided === 'function'
                ? addParameterlessFilter(this.statement, predicateOrProvided)
                : addParameterizedFilter(this.statement, predicate!, predicateOrProvided)
        )
    }

    thenBy(sortBy: (table: T) => Value): SortTable<T> {
        return new SortTable(
            this.typeConstructor,
            addAscendingOrder(this.statement, sortBy)
        )
    }

    thenDescendinglyBy(sortBy: (table: T) => Value): SortTable<T> {
        return new SortTable(
            this.typeConstructor,
            addDescendingOrder(this.statement, sortBy)
        )
    }

    select(): SelectRows<T> {
        return selectTable(this.statement, this.typeConstructor)
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