import {SelectStatement} from '../../select_statement'
import {EnforceNonEmptyRecord, StringValueRecord} from '../../record'
import {parseAggregation} from '../../parsing/selection/aggregation_parsing'
import {AggregatableTable} from './aggregatable_table'
import {SelectGenerator} from '../select_generator'
import {SelectRows} from '../selections/select_rows'

export class GroupTable<T, K extends StringValueRecord> {
    constructor(private readonly statement: SelectStatement) {}

    aggregate<A extends StringValueRecord>(
        aggregation: (key: K, table: AggregatableTable<T>, count: () => number) => EnforceNonEmptyRecord<A> & A): SelectRows<A> {

        return new SelectRows(
            {
                ...this.statement,
                selection: parseAggregation(aggregation, this.statement.key, 1)
            })
    }
}