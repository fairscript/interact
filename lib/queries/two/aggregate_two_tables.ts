import {SelectStatement} from '../../select_statement'
import {SelectSqlGenerator} from '../../sql_generation'
import {parseAggregation} from '../../parsing/aggregation_parsing'
import {AggregatableTable} from '../one/aggregate_table'

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