import {Runnable} from '../../databases/database_context'
import {SelectStatement} from '../../statements/select_statement'
import {GroupSelectStatement} from '../../statements/group_select_statement'

export class OffsetRows<T> implements Runnable<T[]>{

    constructor(public statement: SelectStatement|GroupSelectStatement, public readonly clientInstruction: 'vector'|'rows'|'sets-of-rows') {}

}