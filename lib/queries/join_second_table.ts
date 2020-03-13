import {Constructor, SelectStatement} from '../select_statement'
import {Table} from '../table'
import {parseJoin} from '../parsing/join_parsing'
import {MapTwoTables} from './map_two_tables'
import {SelectTwoTables} from './select_two_tables'

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

    map<U>(f: (first: T1, second: T2) => U): MapTwoTables<T1, T2, U> {
        return new MapTwoTables(this.statement, f)
    }

    select(first: string, second: string): SelectTwoTables<T1, T2> {
        return new SelectTwoTables<T1, T2>(
            this.firstConstructor, this.secondConstructor, this.statement, first, second)
    }
}

