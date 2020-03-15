import {SelectStatement} from '../select_statement'
import {generateSql} from '../generation/sql_generation'

export abstract class SelectSqlGenerator {
    protected constructor(private statement: SelectStatement) {}

    toSql() {
        return generateSql(this.statement)
    }
}

export class ColumnSelection extends SelectSqlGenerator {
    constructor(statement: SelectStatement) {
        super(statement)
    }
}

export class TableSelection extends SelectSqlGenerator {
    constructor(statement: SelectStatement) {
        super(statement)
    }
}