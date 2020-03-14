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

export class AggregateTwoTables<T1, T2, K, A> extends SelectSqlGenerator {
    constructor(
        existingStatement: SelectStatement,
        aggregation: (key: K, first: AggregatableTable<T1>, second: AggregatableTable<T2>) => A) {

        super({
            ...existingStatement,
            selection: parseAggregation(aggregation, existingStatement.key)
        })
    }
}