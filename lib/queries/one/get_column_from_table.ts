import {SelectSqlGenerator} from '../../sql_generation'
import {SelectStatement} from '../../select_statement'
import {Value} from '../../column_operations'
import {parseGet} from '../../generation/get_parsing'

export class GetColumnFromTable<T, U extends Value> extends SelectSqlGenerator {
    constructor(existingStatement: SelectStatement, get: (table: T) => U) {
        super({
            ...existingStatement,
            selection: [parseGet(get)]
        })
    }
}