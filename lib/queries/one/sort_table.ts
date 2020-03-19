import {SelectStatement} from '../../select_statement'
import {parseOrder} from '../../parsing/order_parsing'
import {EnforceNonEmptyRecord, StringValueRecord} from '../../record'
import {GroupTable} from './group_table'
import {Value} from '../../value'
import {parseGet} from '../../parsing/selection/get_parsing'
import {parseMap} from '../../parsing/selection/map_parsing'
import {parseGetKey} from '../../parsing/get_key_parsing'
import {ColumnSelection, TableSelection} from '../selection'
import {parseSelectSingleTable} from '../../parsing/selection/single_table_selection_parsing'

export type Direction = 'asc' | 'desc'

export class SortTable<T> {

    constructor(private readonly statement: SelectStatement) {}

    thenBy(sortBy: (table: T) => Value): SortTable<T> {
        return new SortTable(
            {
                ...this.statement,
                orders: this.statement.orders.concat(parseOrder(sortBy, 'asc'))
            })
    }

    thenDescendinglyBy(sortBy: (table: T) => Value): SortTable<T> {
        return new SortTable(
            {
                ...this.statement,
                orders: this.statement.orders.concat(parseOrder(sortBy, 'desc'))
            })
    }

    select(): TableSelection<T> {
        return new TableSelection({
            ...this.statement,
            selection: parseSelectSingleTable(this.constructor)
        })
    }

    get<U extends Value>(f: (table: T) => U): ColumnSelection<U> {
        return new ColumnSelection(
            {
                ...this.statement,
                selection: parseGet(f)
            })
    }

    map<U extends StringValueRecord>(f: (table: T) => EnforceNonEmptyRecord<U> & U): TableSelection<U> {
        return new TableSelection(
            {
                ...this.statement,
                selection: parseMap(f)
            })
    }

    groupBy<K extends StringValueRecord>(getKey: (table: T) => EnforceNonEmptyRecord<K> & K): GroupTable<T, K> {
        return new GroupTable<T, K>(
            {
                ...this.statement,
                key: parseGetKey(getKey)
            })
    }
}