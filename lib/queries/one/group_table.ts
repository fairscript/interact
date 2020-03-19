import {SelectStatement} from '../../select_statement'
import {EnforceNonEmptyRecord, StringValueRecord} from '../../record'
import {parseAggregation} from '../../parsing/selection/aggregation_parsing'
import {AggregatableTable} from './aggregatable_table'
import {SelectSqlGenerator} from '../selection'

export class GroupTable<T, K extends StringValueRecord> {
    constructor(private readonly statement: SelectStatement) {}

    aggregate<A extends StringValueRecord>(
        aggregation: (key: K, table: AggregatableTable<T>, count: () => number) => EnforceNonEmptyRecord<A> & A): SelectSqlGenerator<A> {

        return new SelectSqlGenerator(
            {
                ...this.statement,
                selection: parseAggregation(aggregation, this.statement.key, 1)
            })
    }
}