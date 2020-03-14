import {Constructor, SelectStatement} from '../../select_statement'
import {parsePredicate} from '../../parsing/predicate_parsing'
import {Value} from '../../column_operations'
import {SortTwoTables} from './sort_two_tables'
import {SelectTwoTables} from './select_two_tables'
import {MapTwoTables} from './map_two_tables'
import {GroupTable} from '../one/group_table'
import {GroupTwoTables} from './group_two_tables'

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

    map<U>(f: (first: T1, second: T2) => U): MapTwoTables<T1, T2, U> {
        return new MapTwoTables(this.statement, f)
    }

    groupBy<K>(getKey: (first: T1, second: T2) => K) : GroupTwoTables<T1, T2, K>{
        return new GroupTwoTables<T1, T2, K>(this.statement, getKey)
    }
}