import {SelectStatement} from '../../select_statement'
import {EnforceNonEmptyRecord, StringValueRecord} from '../../record'
import {parseAggregation} from '../../parsing/aggregation_parsing'
import {AggregatableTable} from './aggregatable_table'
import {TableSelection} from '../selection'

export class GroupTable<T, K extends StringValueRecord> {
    constructor(private readonly statement: SelectStatement) {}

    aggregate<A extends StringValueRecord>(aggregation: (key: K, table: AggregatableTable<T>) => EnforceNonEmptyRecord<A> & A): TableSelection {
        return new TableSelection(
            {
                ...this.statement,
                selection: parseAggregation(aggregation, this.statement.key)
            })
    }
}