import {SelectStatement} from '../select_statement'
import {generateSql} from '../generation/sql_generation'

export class SelectSqlGenerator<T> {
    constructor(private statement: SelectStatement) {}

    toSql() {
        return generateSql(this.statement)
    }
}