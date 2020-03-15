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

export class AggregateTable<T, K extends StringValueRecord, A extends StringValueRecord> extends SelectSqlGenerator {
    constructor(
        existingStatement: SelectStatement,
        aggregation: (key: K, table: AggregatableTable<T>) => EnforceNonEmptyRecord<A> & A) {

        super({
            ...existingStatement,
            selection: parseAggregation(aggregation, existingStatement.key)
        })
    }
}