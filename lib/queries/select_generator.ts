import {SelectStatement} from '../select_statement'
import {generateSql} from '../generation/sql_generation'
import {StringValueRecord} from '../record'
import {Dialect} from '../databases/dialects'

export abstract class SelectGenerator {
    protected constructor(protected statement: SelectStatement) {}

    toSql(dialect: Dialect): [string, StringValueRecord] {
        return generateSql(dialect, this.statement)
    }
}