import {Constructor, SelectStatement} from '../../select_statement'
import {SortTable} from './sort_table'
import {SelectTable} from './select_table'
import {MapTable} from './map_table'
import {GroupTable} from './group_table'
import {parsePredicate} from '../../parsing/predicate_parsing'
import {GetColumnFromTable} from './get_column_from_table'
import {EnforceNonEmptyRecord, StringValueRecord} from '../../record'
import {Value} from '../../value'

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

    sortBy(sortBy: (table: T) => Value): SortTable<T> {
        return new SortTable(this.constructor, this.statement, sortBy, 'asc')
    }

    sortDescendinglyBy(sortBy: (table: T) => Value): SortTable<T> {
        return new SortTable(this.constructor, this.statement, sortBy, 'desc')
    }

    select(): SelectTable<T> {
        return new SelectTable(this.constructor, this.statement)
    }

    get<U extends Value>(f: (table: T) => U): GetColumnFromTable<T, U> {
        return new GetColumnFromTable(this.statement, f)
    }

    map<U extends StringValueRecord>(f: (table: T) => EnforceNonEmptyRecord<U> & U): MapTable<T, U> {
        return new MapTable(this.statement, f)
    }

    groupBy<K extends StringValueRecord>(getKey: (table: T) => EnforceNonEmptyRecord<K> & K): GroupTable<T, K>{
        return new GroupTable<T, K>(this.statement, getKey)
    }
}