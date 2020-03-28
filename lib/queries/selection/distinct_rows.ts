import {SelectStatement} from '../../select_statement'
import {LimitRows} from './limit_rows'
import {Runnable} from '../../databases/database_context'

export class DistinctRows<T> implements Runnable<T[]> {
    constructor(public statement: SelectStatement, public readonly client: 'vector'|'rows') {}

    limit(limit: number): LimitRows<T> {
        return new LimitRows(
            {
                ...this.statement,
                limit
            },
            this.client)
    }
}