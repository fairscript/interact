import {Filter} from '../parsing/filtering/filter_parsing'
import {CountSelection} from '../parsing/selection/count_selection'
import {SingleColumnSelection} from '../parsing/selection/single_column_selection_parsing'
import {ColumnRecord} from '../record'

export interface SubselectStatement {
    selection: CountSelection|SingleColumnSelection
    tableName: string
    filters: Filter[],
    columns: ColumnRecord,
    kind: 'subselect-statement'
}

export function createSubselectStatement(tableName: string, columns: ColumnRecord, filters: Filter[], selection: CountSelection|SingleColumnSelection): SubselectStatement {
    return {
        tableName,
        columns,
        filters,
        selection,
        kind: 'subselect-statement'
    }
}
