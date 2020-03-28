import {SelectStatement} from '../../select_statement'
import {Runnable} from '../../databases/database_context'
import {LimitRows} from './limit_rows'

export class SelectVector<T> implements Runnable<T> {
    constructor(public statement: SelectStatement) {}

    limit(limit: number): LimitRows<T> {
        return new LimitRows(
            {
                ...this.statement,
                limit
            },
            this.client)
    }

    distinct() {
        return new LimitRows(
            {
                ...this.statement,
                distinct: true
            },
            this.client)
    }

    readonly client = 'vector'
}