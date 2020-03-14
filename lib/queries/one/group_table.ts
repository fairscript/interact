import {AggregatableTable, AggregateTable} from './aggregate_table'
import {SelectStatement} from '../../select_statement'
import {parseGetKey} from '../../parsing/get_key_parsing'

export class GroupTable<T, K> {
    private readonly statement: SelectStatement

    constructor(
        existingStatement: SelectStatement,
        getKey: (table: T) => K) {

        this.statement = {
            ...existingStatement,
            key: parseGetKey(getKey)
        }
    }

    aggregate<A>(aggregation: (key: K, table: AggregatableTable<T>) => A): AggregateTable<T, K, A> {
        return new AggregateTable(this.statement, aggregation)
    }
}