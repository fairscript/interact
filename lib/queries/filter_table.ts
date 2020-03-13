import {Constructor, SelectStatement} from '../select_statement'
import {SortedTable} from './sort_table'
import {SelectTable} from './select_table'
import {MapTable} from './map_table'
import {GroupTable} from './group_table'
import {parsePredicate} from '../parsing/predicate_parsing'
import {Value} from '../column_operations'

export class FilterTable<T> {
    private readonly statement: SelectStatement

    constructor(
        private constructor: Constructor<T>,
        existingStatement: SelectStatement,
        predicate: (table: T) => boolean) {
        this.statement = {
            ...existingStatement,
            predicates: existingStatement.predicates.concat(parsePredicate(predicate))
        }
    }

    filter(predicate: (table: T) => boolean): FilterTable<T> {
        return new FilterTable(this.constructor, this.statement, predicate)
    }

    sortBy(sortBy: (table: T) => Value): SortedTable<T> {
        return new SortedTable(this.constructor, this.statement, {sortBy, direction: 'asc'})
    }

    sortDescendinglyBy(sortBy: (table: T) => Value): SortedTable<T> {
        return new SortedTable(this.constructor, this.statement, {sortBy, direction: 'desc'})
    }

    select(): SelectTable<T> {
        return new SelectTable(this.constructor, this.statement)
    }

    map<U>(f: (table: T) => U): MapTable<T, U> {
        return new MapTable(this.statement, f)
    }

    groupBy<K>(getKey: (table: T) => K): GroupTable<T, K> {
        return new GroupTable<T, K>(this.statement, getKey)
    }
}