import {SelectStatement} from '../select_statement'
import {generateSql} from '../generation/sql_generation'
import {StringValueRecord} from '../record'

export abstract class SelectGenerator<T> {
    protected constructor(protected statement: SelectStatement) {}

    toSql() {
        return generateSql(this.statement)
    }

    getParameters(): StringValueRecord {
        return this.statement.filters.reduce(
            (acc, filter) => {
                return {
                    acc,
                    ...filter.parameters
                }
            },
            {})
    }
}

export class ScalarSelectGenerator<T> extends SelectGenerator<T> {
    constructor(statement: SelectStatement) {
        super(statement)
    }

    kind = 'scalar-select-generator'
}

export class SingleRowSelectGenerator<T> extends SelectGenerator<T> {
    constructor(statement: SelectStatement) {
        super(statement)
    }

    kind = 'single-row-select-generator'
}

export class RowSelectGenerator<T> extends SelectGenerator<T[]> {
    constructor(statement: SelectStatement) {
        super(statement)
    }

    single(): SingleRowSelectGenerator<T> {
        return new SingleRowSelectGenerator<T>(this.statement)
    }

    kind = 'row-select-generator'
}