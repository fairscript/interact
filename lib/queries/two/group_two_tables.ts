import {SelectStatement} from '../../select_statement'
import {parseGetKey} from '../../parsing/get_key_parsing'
import {AggregatableTable} from '../one/aggregate_table'
import {AggregateTwoTables} from './aggregate_two_tables'
import {EnforceNonEmptyRecord, StringValueRecord} from '../../record'

export class GroupTwoTables<T1, T2, K extends StringValueRecord> {
    private readonly statement: SelectStatement

    constructor(
        existingStatement: SelectStatement,
        getKey: (first: T1, second: T2) => EnforceNonEmptyRecord<K> & K) {

        this.statement = {
            ...existingStatement,
            key: parseGetKey(getKey)
        }
    }

    aggregate<A extends StringValueRecord>(
        aggregation: (key: K, first: AggregatableTable<T1>, second: AggregatableTable<T2>) => EnforceNonEmptyRecord<A> & A): AggregateTwoTables<T1, T2, K, A> {
        return new AggregateTwoTables<T1, T2, K, A>(this.statement, aggregation)
    }
}