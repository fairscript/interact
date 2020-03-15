import {SelectStatement} from '../../select_statement'
import {SelectSqlGenerator} from '../../sql_generation'
import {parseAggregation} from '../../parsing/aggregation_parsing'
import {EnforceNonEmptyRecord, StringValueRecord} from '../../record'

export type AggregatableColumn<F> = {
    avg(): F
    count(): F
    max(): F
    min(): F
    sum(): F
}

export type AggregatableTable<T> = {
    [F in keyof T]: AggregatableColumn<F>
}

export class AggregateTable extends SelectSqlGenerator {
    constructor(statement: SelectStatement) {
        super(statement)
    }
}