import {SelectSqlGenerator} from '../../sql_generation'
import {SelectStatement} from '../../select_statement'
import {Value} from '../../column_operations'
import {parseGet} from '../../generation/get_parsing'

export class GetColumnFromTwoTables<T1, T2, U extends Value> extends SelectSqlGenerator {
    constructor(existingStatement: SelectStatement, get: (first: T1, second: T2) => U) {
        super({
            ...existingStatement,
            selection: [parseGet(get)]
        })
    }
}