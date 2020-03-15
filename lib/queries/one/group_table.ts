import {AggregatableTable, TableAggregation} from '../selections/table_aggregation'
import {SelectStatement} from '../../select_statement'
import {EnforceNonEmptyRecord, StringValueRecord} from '../../record'
import {parseAggregation} from '../../parsing/aggregation_parsing'

export class GroupTable<T, K extends StringValueRecord> {
    constructor(private readonly statement: SelectStatement) {}

    aggregate<A extends StringValueRecord>(aggregation: (key: K, table: AggregatableTable<T>) => EnforceNonEmptyRecord<A> & A): TableAggregation {
        return new TableAggregation(
            {
                ...this.statement,
                selection: parseAggregation(aggregation, this.statement.key)
            })
    }
}