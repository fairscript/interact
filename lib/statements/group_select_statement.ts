import {Selection} from '../parsing/selection/selection_parsing'
import {Filter} from '../parsing/filtering/filter_parsing'
import {GroupOrderExpression} from '../parsing/sorting/group_sorting_parsing'
import {JoinExpression} from '../parsing/join_parsing'
import {Key} from '../parsing/get_key_parsing'

export interface GroupSelectStatement {
    tableName: string
    key: Key
    filters: Filter[]
    join: JoinExpression | null
    orders: GroupOrderExpression[]
    selection: Selection | null
    limit: number | 'all'
    offset: number,
    distinct: boolean
    kind: 'group-select-statement'
}

export function createEmptyGroupSelectStatement(tableName: string, key: Key): GroupSelectStatement {
    return {
        tableName,
        key,
        filters: [],
        join: null,
        orders: [],
        selection: null,
        limit: 'all',
        offset: 0,
        distinct: false,
        kind: 'group-select-statement'
    }
}