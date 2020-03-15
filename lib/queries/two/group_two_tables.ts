import {SelectStatement} from '../../select_statement'
import {parseGetKey} from '../../parsing/get_key_parsing'
import {AggregatableTable} from '../one/aggregate_table'
import {AggregateTwoTables} from './aggregate_two_tables'

export class GroupTwoTables<T1, T2, K> {
    private readonly statement: SelectStatement

    constructor(
        existingStatement: SelectStatement,
        getKey: (first: T1, second: T2) => K) {

        this.statement = {
            ...existingStatement,
            key: parseGetKey(getKey)
        }
    }

    aggregate<A>(aggregation: (key: K, first: AggregatableTable<T1>, second: AggregatableTable<T2>) => A): AggregateTwoTables<T1, T2, K, A> {
        return new AggregateTwoTables(this.statement, aggregation)
    }
}