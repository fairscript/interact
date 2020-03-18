import {Constructor, SelectStatement} from '../../select_statement'
import {parseOrder} from '../../parsing/order_parsing'
import {EnforceNonEmptyRecord, StringValueRecord} from '../../record'
import {GroupTwoTables} from './group_two_tables'
import {Value} from '../../value'
import {parseGet} from '../../parsing/get_parsing'
import {parseMap} from '../../parsing/map_parsing'
import {parseSelectMultipleTables} from '../../parsing/select_parsing'
import {parseGetKey} from '../../parsing/get_key_parsing'
import {ColumnSelection, TableSelection} from '../selection'

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
                orders: this.statement.orders.concat(parseOrder(sortBy, 'asc'))
            })
    }

    thenDescendinglyBy(sortBy: (first: T1, second: T2) => Value): SortTwoTables<T1, T2> {
        return new SortTwoTables(
            this.firstConstructor,
            this.secondConstructor,
            {
                ...this.statement,
                orders: this.statement.orders.concat(parseOrder(sortBy, 'desc'))
            })
    }

    select<K extends string>(first: string, second: string): TableSelection<{ [first in K]: T1 } & { [second in K]: T2 }> {
        return new TableSelection(
            {
                ...this.statement,
                selection: parseSelectMultipleTables([
                    [first, this.firstConstructor],
                    [second, this.secondConstructor]
                ])
            })
    }

    get<U extends Value>(f: (first: T1, second: T2) => U): ColumnSelection<U> {
        return new ColumnSelection(
            {
                ...this.statement,
                selection: parseGet(f)
            })
    }

    map<U extends StringValueRecord>(f: (first: T1, second: T2) => EnforceNonEmptyRecord<U> & U): TableSelection<U> {
        return new TableSelection(
            {
                ...this.statement,
                selection: parseMap(f)
            })
    }

    groupBy<K extends StringValueRecord>(getKey: (first: T1, second: T2) => EnforceNonEmptyRecord<K> & K) : GroupTwoTables<T1, T2, K>{
        return new GroupTwoTables<T1, T2, K>(
            {
                ...this.statement,
                key: parseGetKey(getKey)
            })
    }
}