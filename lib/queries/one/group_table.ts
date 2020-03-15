import {AggregatableTable, AggregateTable} from './aggregate_table'
import {SelectStatement} from '../../select_statement'
import {parseGetKey} from '../../parsing/get_key_parsing'
import {EnforceNonEmptyRecord, StringValueRecord} from '../../record'

export class GroupTable<T, K extends StringValueRecord> {
    private readonly statement: SelectStatement

    constructor(
        existingStatement: SelectStatement,
        getKey: (table: T) => EnforceNonEmptyRecord<K> & K) {

        this.statement = {
            ...existingStatement,
            key: parseGetKey(getKey)
        }
    }

    aggregate<A extends StringValueRecord>(aggregation: (key: K, table: AggregatableTable<T>) => EnforceNonEmptyRecord<A> & A): AggregateTable<T, K, A> {
        return new AggregateTable<T, K, A>(this.statement, aggregation)
    }
}