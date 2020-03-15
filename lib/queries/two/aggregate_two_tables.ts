import {SelectStatement} from '../../select_statement'
import {SelectSqlGenerator} from '../../sql_generation'

export class AggregateTwoTables extends SelectSqlGenerator {
    constructor(statement: SelectStatement) {
        super(statement)
    }
}