import {SelectStatement} from '../../select_statement'
import {parseSorting} from '../../parsing/sorting/sorting_parsing'
import {EnforceNonEmptyRecord, ValueRecord} from '../../record'
import {Value} from '../../value'
import {parseGetSelection} from '../../parsing/selection/get_selection_parsing'
import {parseMapSelection} from '../../parsing/selection/map_selection_parsing'
import {parseSingleTableSelection} from '../../parsing/selection/single_table_selection_parsing'
import {Subtable} from './subtable'
import {parseMapWithSubquerySelection} from '../../parsing/selection/maps_selection_parsing'
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
            selection: parseSingleTableSelection(this.constructor)
        })
    }

    map<U extends ValueRecord>(f: (table: T) => EnforceNonEmptyRecord<U> & U): SelectRows<U>
    map<S, U extends ValueRecord>(tableInSubquery: Table<S>, f: (s: Subtable<S>, x: T) => EnforceNonEmptyRecord<U> & U): SelectRows<U>
    map<S, U extends ValueRecord>(fOrTableInSubquery: ((table: T) => EnforceNonEmptyRecord<U> & U)|Table<S>, f?: (s: Subtable<S>, x: T) => EnforceNonEmptyRecord<U> & U): SelectRows<U>{
        const selection = typeof fOrTableInSubquery === 'function'
            ? parseMapSelection(fOrTableInSubquery)
            : parseMapWithSubquerySelection(f!, [fOrTableInSubquery.tableName])

        return new SelectRows(
            {
                ...this.statement,
                selection
            })
    }

    get<U extends Value>(f: (table: T) => U): SelectVector<U> {
        return new SelectVector(
            {
                ...this.statement,
                selection: parseGetSelection(f)
            })
    }
}