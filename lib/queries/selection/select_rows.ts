import {SelectStatement} from '../../select_statement'
import {SelectSingleRow} from './select_single_row'
import {LimitRows} from './limit_rows'
import {Runnable} from '../../databases/database_context'

export class SelectRows<T> implements Runnable<T[]> {
    constructor(public statement: SelectStatement) {}

    single(): SelectSingleRow<T> {
        return new SelectSingleRow(this.statement)
    }

    limit(limit: number): LimitRows<T> {
        return new LimitRows(
            {
                ...this.statement,
                limit
            })
    }

    readonly client = 'rows'
}