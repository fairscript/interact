import {SelectStatement} from '../../select_statement'
import {Runnable} from '../../databases/database_context'
import {OffsetRows} from './offset_rows'

export class LimitRows<T> implements Runnable<T[]>{

    constructor(public statement: SelectStatement) {}

    offset(offset: number): OffsetRows<T> {
        return new OffsetRows(
            {
                ...this.statement,
                offset
            })
    }

    readonly client = "rows"
}