import {SelectStatement} from '../select_statement'
import {Table} from '../table'

export class JoinSecondTable<T1, T2, K1>{
    private readonly statement: SelectStatement

    constructor(
        existingStatement: SelectStatement,
        otherTable: Table<T2>,
        left: (firstTable: T1) => K1,
        right: (secondTable: T2) => K1) {

        this.statement = {
            ...existingStatement
        }
    }
}