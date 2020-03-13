import {Constructor, SelectStatement} from './select_statement'
import {FilterTable} from './queries/filter_table'
import {SortedTable} from './queries/sort_table'
import {SelectTable} from './queries/select_table'
import {MapTable} from './queries/map_table'
import {GroupTable} from './queries/group_table'
import {JoinSecondTable} from './queries/join_second_table'
import {Value} from './column_operations'


export class Table<T> {
    private readonly statement: SelectStatement

    constructor(
        protected constructor: Constructor<T>,
        protected tableName: string) {

        this.statement = {
            tableName,
            selection: [],
            predicates: [],
            orders: [],
            joins: [],
            key: null
        }
    }

    filter(predicate: (table: T) => boolean): FilterTable<T> {
        return new FilterTable(this.constructor, this.statement, predicate)
    }

    sortBy(by: (table: T) => Value): SortedTable<T> {
        return new SortedTable(this.constructor, this.statement, { sortBy: by, direction: 'asc' })
    }

    sortDescendinglyBy(by: (table: T) => Value): SortedTable<T> {
        return new SortedTable(this.constructor, this.statement, { sortBy: by, direction: 'desc' })
    }

    select(): SelectTable<T> {
        return new SelectTable(this.constructor, this.statement)
    }

    map<U>(f: (table: T) => U): MapTable<T, U> {
        return new MapTable(this.statement, f)
    }

    groupBy<K>(getKey: (table: T) => K) : GroupTable<T, K>{
        return new GroupTable<T, K>(this.statement, getKey)
    }

    join<U, K>(otherTable: Table<U>, left: (firstTable: T) => K, right: (secondTable: U) => K) {
        return new JoinSecondTable<T, U, K>(this.constructor, otherTable.constructor, this.statement, otherTable.tableName, left, right)
    }
}

export function defineTable<T>(constructor: Constructor<T>, name: string): Table<T> {
    return new Table<T>(constructor, name)
}