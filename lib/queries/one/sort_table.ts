import {SelectStatement} from '../../select_statement'
import {parseSorting} from '../../parsing/sorting/sorting_parsing'
import {EnforceNonEmptyRecord, StringValueRecord} from '../../record'
import {Value} from '../../value'
import {parseGet} from '../../parsing/selection/get_parsing'
import {parseMap} from '../../parsing/selection/map_parsing'
import {parseSelectSingleTable} from '../../parsing/selection/single_table_selection_parsing'
import {Subtable} from './subtable'
import {parseMapS} from '../../parsing/selection/maps_parsing'
import {Table} from './table'
import {SelectRows} from '../selection/select_rows'
import {SelectVector} from '../selection/select_vector'

export type Direction = 'asc' | 'desc'

export class SortTable<T> {

    constructor(private readonly statement: SelectStatement) {}

    thenBy(sortBy: (table: T) => Value): SortTable<T> {
        return new SortTable(
            {
                ...this.statement,
                orders: this.statement.orders.concat(parseSorting(sortBy, 'asc'))
            })
    }

    thenDescendinglyBy(sortBy: (table: T) => Value): SortTable<T> {
        return new SortTable(
            {
                ...this.statement,
                orders: this.statement.orders.concat(parseSorting(sortBy, 'desc'))
            })
    }

    select(): SelectRows<T> {
        return new SelectRows({
            ...this.statement,
            selection: parseSelectSingleTable(this.constructor)
        })
    }

    map<U extends StringValueRecord>(f: (table: T) => EnforceNonEmptyRecord<U> & U): SelectRows<U> {
        return new SelectRows(
            {
                ...this.statement,
                selection: parseMap(f)
            })
    }

    mapS<S, U extends StringValueRecord>(tableInSubquery: Table<S>, f: (s: Subtable<S>, x: T) => EnforceNonEmptyRecord<U> & U): SelectRows<U> {
        return new SelectRows(
            {
                ...this.statement,
                selection: parseMapS(f, [tableInSubquery.tableName])
            })
    }

    get<U extends Value>(f: (table: T) => U): SelectVector<U> {
        return new SelectVector(
            {
                ...this.statement,
                selection: parseGet(f)
            })
    }
}