import {Constructor, SelectStatement} from '../select_statement'
import {SortTable} from './sort_table'
import {SelectTable} from './select_table'
import {MapTable} from './map_table'
import {GroupTable} from './group_table'
import {By, Predicate} from '../table'
import {parsePredicate} from '../parsing/predicate_parsing'

export class FilterTable<T> {
    private readonly statement: SelectStatement

    constructor(
        private constructor: Constructor<T>,
        existingStatement: SelectStatement,
        predicate: Predicate<T>
    ) {
        this.statement = {
            ...existingStatement,
            predicates: existingStatement.predicates.concat(parsePredicate(predicate))
        }
    }

    filter(predicate: Predicate<T>): FilterTable<T> {
        return new FilterTable(this.constructor, this.statement, predicate)
    }

    sortBy(by: By<T>): SortTable<T> {
        return new SortTable(this.constructor, this.statement, {by, direction: 'asc'})
    }

    sortDescendinglyBy(by: By<T>): SortTable<T> {
        return new SortTable(this.constructor, this.statement, {by, direction: 'desc'})
    }

    select(): SelectTable<T> {
        return new SelectTable(this.constructor, this.statement)
    }

    map<U>(f: (x: T) => U): MapTable<T, U> {
        return new MapTable(this.statement, f)
    }

    groupBy<K>(getKey: (x: T) => K): GroupTable<T, K> {
        return new GroupTable<T, K>(this.statement, getKey)
    }
}