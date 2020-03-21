import {SelectStatement} from '../../select_statement'
import {EnforceNonEmptyRecord, StringValueRecord} from '../../record'
import {parseAggregation} from '../../parsing/selection/aggregation_parsing'
import {AggregatableTable} from './aggregatable_table'
import {RowSelectGenerator, SelectGenerator} from '../select_generators'

export class GroupTable<T, K extends StringValueRecord> {
    constructor(private readonly statement: SelectStatement) {}

    aggregate<A extends StringValueRecord>(
        aggregation: (key: K, table: AggregatableTable<T>, count: () => number) => EnforceNonEmptyRecord<A> & A): RowSelectGenerator<A> {

        return new RowSelectGenerator(
            {
                ...this.statement,
                selection: parseAggregation(aggregation, this.statement.key, 1)
            })
    }
}