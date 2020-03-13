import {SelectStatement} from '../select_statement'
import {Table} from '../table'
import {parseJoin} from '../parsing/join_parsing'

export class JoinSecondTable<T1, T2, K1>{
    private readonly statement: SelectStatement

    constructor(
        existingStatement: SelectStatement,
        secondTable: Table<T2>,
        left: (firstTable: T1) => K1,
        right: (secondTable: T2) => K1) {

        this.statement = {
            ...existingStatement,
            joins: this.statement.joins.concat([parseJoin(secondTable.tableName, left, right)])
        }
    }
}