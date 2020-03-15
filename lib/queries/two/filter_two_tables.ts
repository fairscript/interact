import {Constructor, SelectStatement} from '../../select_statement'
import {parsePredicate} from '../../parsing/predicate_parsing'
import {SortTwoTables} from './sort_two_tables'
import {SelectTwoTables} from './select_two_tables'
import {MapTwoTables} from './map_two_tables'
import {GroupTwoTables} from './group_two_tables'
import {GetColumnFromTwoTables} from './get_column_from_two_tables'
import {EnforceNonEmptyRecord, StringValueRecord} from '../../record'
import {Value} from '../../value'

export class FilterTwoTables<T1, T2> {
    private readonly statement: SelectStatement

    constructor(
        private firstConstructor: Constructor<T1>,
        private secondConstructor: Constructor<T2>,
        existingStatement: SelectStatement,
        predicate: (first: T1, second: T2) => boolean) {
        this.statement = {
            ...existingStatement,
            predicates: existingStatement.predicates.concat(parsePredicate(predicate))
        }
    }

    filter(predicate: (first: T1, second: T2) => boolean): FilterTwoTables<T1, T2> {
        return new FilterTwoTables(this.firstConstructor, this.secondConstructor, this.statement, predicate)
    }

    sortBy(sortBy: (first: T1, second: T2) => Value): SortTwoTables<T1, T2> {
        return new SortTwoTables(this.firstConstructor, this.secondConstructor, this.statement, sortBy, 'asc')
    }

    sortDescendinglyBy(sortBy: (first: T1, second: T2) => Value): SortTwoTables<T1, T2> {
        return new SortTwoTables(this.firstConstructor, this.secondConstructor, this.statement, sortBy, 'desc')
    }

    select(first: string, second: string): SelectTwoTables<T1, T2> {
        return new SelectTwoTables(this.firstConstructor, this.secondConstructor, this.statement, first, second)
    }

    get<U extends Value>(f: (first: T1, second: T2) => U): GetColumnFromTwoTables<T1, T2, U> {
        return new GetColumnFromTwoTables(this.statement, f)
    }

    map<U extends StringValueRecord>(f: (first: T1, second: T2) => EnforceNonEmptyRecord<U> & U): MapTwoTables<T1, T2, U> {
        return new MapTwoTables(this.statement, f)
    }

    groupBy<K extends StringValueRecord>(getKey: (first: T1, second: T2) => EnforceNonEmptyRecord<K> & K) : GroupTwoTables<T1, T2, K>{
        return new GroupTwoTables<T1, T2, K>(this.statement, getKey)
    }
}