import {LimitRows} from './limit_rows'
import {parseGetSelection} from '../../parsing/selection/get_selection_parsing'
import {Runnable} from '../../databases/database_context'
import {SelectStatement} from '../../statements/select_statement'
import {SelectScalar} from './select_scalar'
import {DistinctRows} from './distinct_rows'

export class SelectVector<T> implements Runnable<T> {
    constructor(public statement: SelectStatement) {}

    single(): SelectScalar<T> {
        return new SelectScalar(this.statement)
    }

    limit(limit: number): LimitRows<T> {
        return new LimitRows(
            {
                ...this.statement,
                limit
            },
            this.clientInstruction)
    }

    distinct() {
        return new DistinctRows(
            {
                ...this.statement,
                distinct: true
            },
            this.clientInstruction)
    }

    readonly clientInstruction = 'vector'
}

export function getColumn<T>(statement: SelectStatement, get: Function): SelectVector<T> {
    return new SelectVector(
        {
            ...statement,
            selection: parseGetSelection(get)
        })
}