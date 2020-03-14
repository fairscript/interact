import {SelectStatement} from '../../select_statement'
import {SelectSqlGenerator} from '../../sql_generation'
import {parseAggregation} from '../../parsing/aggregation_parsing'

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

export class AggregateTable<T, K, A> extends SelectSqlGenerator {
    constructor(
        existingStatement: SelectStatement,
        private readonly aggregate: (key: K, table: AggregatableTable<T>) => A) {

        super({
            ...existingStatement,
            selection: parseAggregation<T, K, A>(aggregate)
        })
    }
}