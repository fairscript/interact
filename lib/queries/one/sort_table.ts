import {Constructor, SelectStatement} from '../../select_statement'
import {SelectTable} from '../selections/select_table'
import {MapTable} from '../selections/map_table'
import {SelectSqlGenerator} from '../../sql_generation'
import {parseOrder} from '../../parsing/order_parsing'
import {GetColumnFromTable} from '../selections/get_column_from_table'
import {EnforceNonEmptyRecord, StringValueRecord} from '../../record'
import {GroupTable} from './group_table'
import {Value} from '../../value'
import {parseSingleTableSelect} from '../../parsing/select_parsing'
import {parseGet} from '../../generation/get_parsing'
import {parseMap} from '../../parsing/map_parsing'
import {parseGetKey} from '../../parsing/get_key_parsing'

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

    select(): SelectTable {
        return new SelectTable({
            ...this.statement,
            selection: parseSingleTableSelect(this.constructor)
        })
    }

    get<U extends Value>(f: (table: T) => U): GetColumnFromTable {
        return new GetColumnFromTable(
            {
                ...this.statement,
                selection: [parseGet(f)]
            })
    }

    map<U extends StringValueRecord>(f: (table: T) => EnforceNonEmptyRecord<U> & U): MapTable {
        return new MapTable(
            {
                ...this.statement,
                selection: parseMap(f)
            })
    }

    groupBy<K extends StringValueRecord>(getKey: (table: T) => EnforceNonEmptyRecord<K> & K): GroupTable<T, K>{
        return new GroupTable<T, K>(
            {
                ...this.statement,
                key: parseGetKey(getKey)
            })
    }
}