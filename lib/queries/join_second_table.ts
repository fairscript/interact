import {SelectStatement} from '../select_statement'
import {Table} from '../table'
import {parseJoin} from '../parsing/join_parsing'
import {MapTwoTables} from './map_two_tables'

export class JoinSecondTable<T1, T2, K1> {
    private readonly statement: SelectStatement

    constructor(
        existingStatement: SelectStatement,
        secondTable: Table<T2>,
        left: (firstTable: T1) => K1,
        right: (secondTable: T2) => K1) {

        this.statement = {
            ...existingStatement,
            joins: existingStatement.joins.concat([parseJoin(secondTable.tableName, left, right)])
        }
    }

    map<U>(f: (first: T1, second: T2) => U): MapTwoTables<T1, T2, U> {
        return new MapTwoTables(this.statement, f)
    }
}

