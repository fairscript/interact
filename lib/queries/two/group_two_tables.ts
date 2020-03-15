import {SelectStatement} from '../../select_statement'
import {EnforceNonEmptyRecord, StringValueRecord} from '../../record'
import {parseAggregation} from '../../parsing/aggregation_parsing'
import {AggregatableTable} from '../one/aggregatable_table'
import {TableSelection} from '../selections/table_selection'

export class GroupTwoTables<T1, T2, K extends StringValueRecord> {
    constructor(private readonly statement: SelectStatement) {}

    aggregate<A extends StringValueRecord>(
        aggregation: (key: K, first: AggregatableTable<T1>, second: AggregatableTable<T2>) => EnforceNonEmptyRecord<A> & A): TableSelection {
        return new TableSelection(
            {
                ...this.statement,
                selection: parseAggregation(aggregation, this.statement.key)
            })
    }
}