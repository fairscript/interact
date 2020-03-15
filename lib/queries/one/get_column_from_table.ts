import {SelectSqlGenerator} from '../../sql_generation'
import {SelectStatement} from '../../select_statement'
import {parseGet} from '../../generation/get_parsing'
import {Value} from '../../value'

export class GetColumnFromTable<T, U extends Value> extends SelectSqlGenerator {
    constructor(existingStatement: SelectStatement, get: (table: T) => U) {
        super({
            ...existingStatement,
            selection: [parseGet(get)]
        })
    }
}