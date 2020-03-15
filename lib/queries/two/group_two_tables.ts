import {SelectStatement} from '../../select_statement'
import {AggregatableTable} from '../one/aggregate_table'
import {AggregateTwoTables} from './aggregate_two_tables'
import {EnforceNonEmptyRecord, StringValueRecord} from '../../record'
import {parseAggregation} from '../../parsing/aggregation_parsing'

export class GroupTwoTables<T1, T2, K extends StringValueRecord> {
    constructor(private readonly statement: SelectStatement) {}

    aggregate<A extends StringValueRecord>(
        aggregation: (key: K, first: AggregatableTable<T1>, second: AggregatableTable<T2>) => EnforceNonEmptyRecord<A> & A): AggregateTwoTables {
        return new AggregateTwoTables(
            {
                ...this.statement,
                selection: parseAggregation(aggregation, this.statement.key)
            })
    }
}