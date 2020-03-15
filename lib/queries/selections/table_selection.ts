import {SelectStatement} from '../../select_statement'
import {SelectSqlGenerator} from '../../sql_generation'

export class TableSelection extends SelectSqlGenerator {
    constructor(existingStatement: SelectStatement) {
        super(existingStatement)
    }
}