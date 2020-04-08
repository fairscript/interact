import {Runnable} from '../../databases/database_context'
import {SelectStatement} from '../../statements/select_statement'
import {GroupSelectStatement} from '../../statements/group_select_statement'
import {parseTableAggregationSelection} from '../../parsing/selection/table_aggregation_selection_parsing'

export class SelectSingleRow<T> implements Runnable<T> {
    constructor(public statement: SelectStatement|GroupSelectStatement) {}

    readonly client = 'single-row'
}

export function aggregateTables<A>(statement: SelectStatement, aggregation: Function): SelectSingleRow<A> {
    return new SelectSingleRow({
        ...statement,
        selection: parseTableAggregationSelection(aggregation, statement.joins.length+1)
    })
}