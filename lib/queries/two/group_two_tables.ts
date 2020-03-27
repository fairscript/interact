import {SelectStatement} from '../../select_statement'
import {EnforceNonEmptyRecord, StringValueRecord} from '../../record'
import {parseAggregation} from '../../parsing/selection/aggregation_parsing'
import {AggregatableTable} from '../one/aggregatable_table'
import {SelectRows} from '../selection/select_rows'

export class GroupTwoTables<T1, T2, K extends StringValueRecord> {
    constructor(private readonly statement: SelectStatement) {}

    aggregate<A extends StringValueRecord>(
        aggregation: (key: K, first: AggregatableTable<T1>, second: AggregatableTable<T2>) => EnforceNonEmptyRecord<A> & A): SelectRows<A> {
        return new SelectRows(
            {
                ...this.statement,
                selection: parseAggregation(aggregation, this.statement.key!, 2)
            })
    }
}