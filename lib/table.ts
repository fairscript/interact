import {Constructor, SelectStatement} from './select_statement'
import {FilterTable} from './queries/filter_table'
import {SortTable} from './queries/sort_table'
import {SelectTable} from './queries/select_table'
import {MapTable} from './queries/map_table'
import {GroupTable} from './queries/group_table'


export type Predicate<T> = (x: T) => boolean

export type By<T> = (x: T) => number | string
export type Order<T> = {
    by: By<T>
    direction: 'asc' | 'desc'
}

class Table<T> {
    private readonly statement: SelectStatement

    constructor(
        private constructor: Constructor<T>,
        tableName: string) {

        this.statement = {
            tableName,
            selection: [],
            predicates: [],
            orders: [],
            key: null
        }
    }

    filter(predicate: Predicate<T>): FilterTable<T> {
        return new FilterTable(this.constructor, this.statement, predicate)
    }

    sortBy(by: By<T>): SortTable<T> {
        return new SortTable(this.constructor, this.statement, { by, direction: 'asc' })
    }

    sortDescendinglyBy(by: By<T>): SortTable<T> {
        return new SortTable(this.constructor, this.statement, { by, direction: 'desc' })
    }

    select(): SelectTable<T> {
        return new SelectTable(this.constructor, this.statement)
    }

    map<U>(f: (x: T) => U): MapTable<T, U> {
        return new MapTable(this.statement, f)
    }

    groupBy<K>(getKey: (x: T) => K) : GroupTable<T, K>{
        return new GroupTable<T, K>(this.statement, getKey)
    }
}

export function createTable<T>(constructor: Constructor<T>, name: string): Table<T> {
    return new Table<T>(constructor, name)
}