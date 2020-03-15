import {SelectSqlGenerator} from '../../sql_generation'
import {SelectStatement} from '../../select_statement'

export class GetColumnFromTable extends SelectSqlGenerator {
    constructor(existingStatement: SelectStatement) {
        super(existingStatement)
    }
}