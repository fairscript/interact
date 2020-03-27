import {SelectStatement} from '../../select_statement'
import {Runnable} from '../../databases/database_context'

export class SelectScalar<T> implements Runnable<T> {
    constructor(public statement: SelectStatement) {}

    readonly client = 'scalar'
}