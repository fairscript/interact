import {LimitRows} from './limit_rows'
import {Runnable} from '../../databases/database_context'
import {SelectStatement} from '../../statements/select_statement'

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