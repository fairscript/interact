import {Constructor, createGroupSelectStatement, SelectStatement} from '../../select_statement'
import {parseSorting} from '../../parsing/sorting/sorting_parsing'
import {EnforceNonEmptyRecord, ValueRecord} from '../../record'
import {GroupTwoTables} from './group_two_tables'
import {Value} from '../../value'
import {parseGetSelection} from '../../parsing/selection/get_selection_parsing'
import {parseMapSelection} from '../../parsing/selection/map_selection_parsing'
import {parseGetKey} from '../../parsing/get_key_parsing'
import {parseMultipleTableSelection} from '../../parsing/selection/multi_table_selection_parsing'
import {Table} from '../one/table'
import {Subtable} from '../one/subtable'
import {parseMapWithSubquerySelection} from '../../parsing/selection/maps_selection_parsing'
import {SelectRows} from '../selection/select_rows'
import {SelectVector} from '../selection/select_vector'

export class SortTwoTables<T1, T2> {

    constructor(
        private firstConstructor: Constructor<T1>,
        private secondConstructor: Constructor<T2>,
        private readonly statement: SelectStatement) {}

    thenBy(sortBy: (first: T1, second: T2) => Value): SortTwoTables<T1, T2> {
        return new SortTwoTables(
            this.firstConstructor,
            this.secondConstructor,
            {
                ...this.statement,
                orders: this.statement.orders.concat(parseSorting(sortBy, 'asc'))
            })
    }

    thenDescendinglyBy(sortBy: (first: T1, second: T2) => Value): SortTwoTables<T1, T2> {
        return new SortTwoTables(
            this.firstConstructor,
            this.secondConstructor,
            {
                ...this.statement,
                orders: this.statement.orders.concat(parseSorting(sortBy, 'desc'))
            })
    }

    select<K extends string>(first: string, second: string): SelectRows<{ [first in K]: T1 } & { [second in K]: T2 }> {
        return new SelectRows(
            {
                ...this.statement,
                selection: parseMultipleTableSelection([
                    [first, this.firstConstructor],
                    [second, this.secondConstructor]
                ])
            })
    }

    map<U extends ValueRecord>(f: (first: T1, second: T2) => EnforceNonEmptyRecord<U> & U): SelectRows<U>
    map<S, U extends ValueRecord>(tableInSubquery: Table<S>, f: (s: Subtable<S>, first: T1, second: T2) => EnforceNonEmptyRecord<U> & U): SelectRows<U>
    map<S, U extends ValueRecord>(fOrTableInSubquery: ((first: T1, second: T2) => EnforceNonEmptyRecord<U> & U)|Table<S>, f?: (s: Subtable<S>, first: T1, second: T2) => EnforceNonEmptyRecord<U> & U): SelectRows<U>{
        const selection = typeof fOrTableInSubquery === 'function'
            ? parseMapSelection(fOrTableInSubquery)
            : parseMapWithSubquerySelection(f!, [fOrTableInSubquery.tableName])

        return new SelectRows(
            {
                ...this.statement,
                selection
            })
    }

    get<U extends Value>(f: (first: T1, second: T2) => U): SelectVector<U> {
        return new SelectVector(
            {
                ...this.statement,
                selection: parseGetSelection(f)
            })
    }

    groupBy<K extends ValueRecord>(getKey: (first: T1, second: T2) => EnforceNonEmptyRecord<K> & K) : GroupTwoTables<T1, T2, K>{
        return new GroupTwoTables<T1, T2, K>(
            createGroupSelectStatement(this.statement, parseGetKey(getKey))
        )
    }
}