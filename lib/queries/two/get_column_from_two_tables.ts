import {SelectSqlGenerator} from '../../sql_generation'
import {SelectStatement} from '../../select_statement'

export class GetColumnFromTwoTables extends SelectSqlGenerator {
    constructor(statement: SelectStatement) {
        super(statement)
    }
}