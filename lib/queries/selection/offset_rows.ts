import {SelectStatement} from '../../select_statement'
import {Runnable} from '../../databases/database_context'

export class OffsetRows<T> implements Runnable<T[]>{

    constructor(public statement: SelectStatement, public readonly client: 'vector'|'rows') {}

}