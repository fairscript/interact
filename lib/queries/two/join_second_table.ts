import {Constructor, SelectStatement} from '../../select_statement'
import {parseJoin} from '../../parsing/join_parsing'
import {MapTwoTables} from './map_two_tables'
import {SelectTwoTables} from './select_two_tables'
import {SortTwoTables} from './sort_two_tables'
import {FilterTwoTables} from './filter_two_tables'
import {GroupTwoTables} from './group_two_tables'
import {GetColumnFromTwoTables} from './get_column_from_two_tables'
import {EnforceNonEmptyRecord, StringValueRecord} from '../../record'
import {Value} from '../../value'

export class JoinSecondTable<T1, T2, K1> {
    private readonly statement: SelectStatement

    constructor(
        private firstConstructor: Constructor<T1>,
        private secondConstructor: Constructor<T2>,
        existingStatement: SelectStatement,
        secondTableName: string,
        left: (firstTable: T1) => K1,
        right: (secondTable: T2) => K1) {

        this.statement = {
            ...existingStatement,
            joins: existingStatement.joins.concat([parseJoin(secondTableName, left, right)])
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

    get<U extends Value>(f: (first: T1, second: T2) => U): GetColumnFromTwoTables<T1, T2, U> {
        return new GetColumnFromTwoTables(this.statement, f)
    }

    select(first: string, second: string): SelectTwoTables<T1, T2> {
        return new SelectTwoTables<T1, T2>(this.firstConstructor, this.secondConstructor, this.statement, first, second)
    }

    map<U extends StringValueRecord>(f: (first: T1, second: T2) => EnforceNonEmptyRecord<U> & U): MapTwoTables<T1, T2, U> {
        return new MapTwoTables(this.statement, f)
    }

    groupBy<K extends StringValueRecord>(getKey: (first: T1, second: T2) => EnforceNonEmptyRecord<K> & K) : GroupTwoTables<T1, T2, K>{
        return new GroupTwoTables<T1, T2, K>(this.statement, getKey)
    }
}

