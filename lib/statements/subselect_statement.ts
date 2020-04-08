import {Filter} from '../parsing/filtering/filter_parsing'
import {CountSelection} from '../parsing/selection/count_selection'
import {SingleColumnSelection} from '../parsing/selection/single_column_selection_parsing'

export interface SubselectStatement {
    tableName: string
    filters: Filter[],
    selection: CountSelection|SingleColumnSelection
    kind: 'subselect-statement'
}

export function createSubselectStatement(tableName: string, filters: Filter[], selection: CountSelection|SingleColumnSelection): SubselectStatement {
    return {
        tableName,
        filters,
        selection,
        kind: 'subselect-statement'
    }
}
