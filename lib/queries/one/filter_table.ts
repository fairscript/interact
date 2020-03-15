import {Constructor, SelectStatement} from '../../select_statement'
import {SortTable} from './sort_table'
import {GroupTable} from './group_table'
import {parsePredicate} from '../../parsing/predicate_parsing'
import {EnforceNonEmptyRecord, StringValueRecord} from '../../record'
import {Value} from '../../value'
import {parseOrder} from '../../parsing/order_parsing'
import {parseSingleTableSelect} from '../../parsing/select_parsing'
import {parseGet} from '../../generation/get_parsing'
import {parseMap} from '../../parsing/map_parsing'
import {parseGetKey} from '../../parsing/get_key_parsing'
import {createCount} from '../../column_operations'
import {ColumnSelection, TableSelection} from '../selection'

export class FilterTable<T> {

    constructor(
        private readonly constructor: Constructor<T>,
        private readonly statement: SelectStatement) {}

    filter(predicate: (table: T) => boolean): FilterTable<T> {
        return new FilterTable(
            this.constructor,
            {
                ...this.statement,
                predicates: this.statement.predicates.concat(parsePredicate(predicate))
            }
        )
    }

    sortBy(sortBy: (table: T) => Value): SortTable<T> {
        return new SortTable(
            {
                ...this.statement,
                orders: this.statement.orders.concat(parseOrder(sortBy, 'asc'))
            })
    }

    sortDescendinglyBy(sortBy: (table: T) => Value): SortTable<T> {
        return new SortTable(
            {
                ...this.statement,
                orders: this.statement.orders.concat(parseOrder(sortBy, 'desc'))
            })
    }

    select(): TableSelection<T> {
        return new TableSelection(
            {
                ...this.statement,
                selection: parseSingleTableSelect(this.constructor)
            })
    }

    get<U extends Value>(f: (table: T) => U): ColumnSelection<U> {
        return new ColumnSelection(
            {
                ...this.statement,
                selection: [parseGet(f)]
            })
    }

    count(): ColumnSelection<number> {
        return new ColumnSelection(
            {
                ...this.statement,
                selection: [createCount()]
            })
    }

    map<U extends StringValueRecord>(f: (table: T) => EnforceNonEmptyRecord<U> & U): TableSelection<U> {
        return new TableSelection(
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