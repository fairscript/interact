import {SelectSingleRow} from './select_single_row'
import {LimitRows} from './limit_rows'
import {Runnable} from '../../databases/database_context'
import {SelectStatement} from '../../statements/select_statement'
import {GroupSelectStatement} from '../../statements/group_select_statement'

export class SelectRows<T> implements Runnable<T[]> {
    constructor(public statement: SelectStatement|GroupSelectStatement) {}

    single(): SelectSingleRow<T> {
        return new SelectSingleRow(this.statement)
    }

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

    readonly client = 'rows'
}