import {GroupSelectStatement, SelectStatement} from '../../select_statement'
import {Runnable} from '../../databases/database_context'

export class OffsetRows<T> implements Runnable<T[]>{

    constructor(public statement: SelectStatement|GroupSelectStatement, public readonly client: 'vector'|'rows') {}

}