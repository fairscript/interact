import {SelectStatement} from '../select_statement'
import {SelectSqlGenerator} from '../sql_generation'
import {parseAggregate} from '../parsing/aggregation_parsing'

interface AggregatableField<F> {
    avg(): F
    count(): F
    max(): F
    min(): F
    sum(): F
}

export type Aggregatable<T> = {
    [F in keyof T]: AggregatableField<F>
}

export class AggregateTable<T, K, A> extends SelectSqlGenerator {
    constructor(
        existingStatement: SelectStatement,
        private readonly aggregation: (key: K, x: Aggregatable<T>) => A) {

        super({
            ...existingStatement,
            selection: parseAggregate<T, K, A>(aggregation)
        })
    }
}