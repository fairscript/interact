import {SelectStatement} from '../select_statement'
import {generateSql} from '../generation/sql_generation'
import {ColumnSelectionToValue} from '../record'

export abstract class SelectSqlGenerator {
    protected constructor(private statement: SelectStatement) {}

    toSql() {
        return generateSql(this.statement)
    }
}

export class ColumnSelection<T> extends SelectSqlGenerator {
    constructor(statement: SelectStatement) {
        super(statement)
    }

    readonly kind = 'column-selection'
}

export class TableSelection<T> extends SelectSqlGenerator {
    constructor(statement: SelectStatement) {
        super(statement)
    }

    get(): ColumnSelectionToValue<T> {
        throw ''
    }

    readonly kind = 'table-selection'
}