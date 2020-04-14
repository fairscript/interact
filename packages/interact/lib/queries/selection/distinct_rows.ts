import {Runnable} from '../../databases/database_context'
import {SelectStatement} from '../../statements/select_statement'
import {LimitRows} from './limit_rows'
import {GroupSelectStatement} from '../../statements/group_select_statement'

export class DistinctRows<T> implements Runnable<T[]>{
    constructor(public statement: SelectStatement|GroupSelectStatement, public readonly clientInstruction: 'vector'|'rows'|'sets-of-rows') {}

    limit(limit: number): LimitRows<T> {
        return new LimitRows(
            {
                ...this.statement,
                limit
            },
            this.clientInstruction)
    }
}