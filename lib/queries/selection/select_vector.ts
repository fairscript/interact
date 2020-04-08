import {Runnable} from '../../databases/database_context'
import {LimitRows} from './limit_rows'
import {SelectStatement} from '../../statements/select_statement'
import {parseGetSelection} from '../../parsing/selection/get_selection_parsing'

export class SelectVector<T> implements Runnable<T> {
    constructor(public statement: SelectStatement) {}

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

    readonly client = 'vector'
}

export function getColumn<T>(statement: SelectStatement, get: Function): SelectVector<T> {
    return new SelectVector(
        {
            ...statement,
            selection: parseGetSelection(get)
        })
}