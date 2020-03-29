import {GroupSelectStatement, SelectStatement} from '../../select_statement'
import {Runnable} from '../../databases/database_context'

export class SelectSingleRow<T> implements Runnable<T> {
    constructor(public statement: SelectStatement|GroupSelectStatement) {}

    readonly client = 'single-row'
}