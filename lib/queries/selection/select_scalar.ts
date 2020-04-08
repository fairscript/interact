import {Runnable} from '../../databases/database_context'
import {SelectStatement} from '../../statements/select_statement'

export class SelectScalar<T> implements Runnable<T> {
    constructor(public statement: SelectStatement) {}

    readonly client = 'scalar'
}