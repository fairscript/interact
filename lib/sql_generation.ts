import {SelectStatement} from './select_statement'
import {generateSql} from './generation/sql_generation'

export abstract class SelectSqlGenerator {
    protected constructor(protected statement: SelectStatement) {}

    toSql() {
        return generateSql(this.statement)
    }
}