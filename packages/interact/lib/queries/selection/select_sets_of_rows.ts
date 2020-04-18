import {LimitRows} from './limit_rows'
import {Runnable} from '../../databases/database_context'
import {SelectStatement} from '../../statements/select_statement'
import {DistinctRows} from './distinct_rows'
import {createMultiTableSelection} from '../../parsing/selection/multi_table_selection_parsing'

export class SelectSetsOfRows<T> implements Runnable<T[]> {
    constructor(public statement: SelectStatement) {}

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

    readonly clientInstruction = 'sets-of-rows'
}

export function selectSetsOfRows<Ts>(
    statement: SelectStatement,
    names: string[]): SelectSetsOfRows<Ts> {

    return new SelectSetsOfRows(
        {
            ...statement,
            selection: createMultiTableSelection(names)
        })
}
