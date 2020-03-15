import {SelectSqlGenerator} from '../../sql_generation'
import {SelectStatement} from '../../select_statement'
import {parseGet} from '../../generation/get_parsing'
import {Value} from '../../value'

export class GetColumnFromTwoTables<T1, T2, U extends Value> extends SelectSqlGenerator {
    constructor(existingStatement: SelectStatement, get: (first: T1, second: T2) => U) {
        super({
            ...existingStatement,
            selection: [parseGet(get)]
        })
    }
}