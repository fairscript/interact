import {parseTableAggregationSelection} from '../../parsing/selection/table_aggregation_selection_parsing'
import {Runnable} from '../../databases/database_context'
import {SelectStatement} from '../../statements/select_statement'
import {GroupSelectStatement} from '../../statements/group_select_statement'

export class SelectGuaranteedSingleRow<T> implements Runnable<T> {
    constructor(public statement: SelectStatement|GroupSelectStatement) {}

    readonly clientInstruction = 'guarantee-single-row'
}

export function aggregateTables<A>(statement: SelectStatement, aggregation: Function): SelectGuaranteedSingleRow<A> {
    return new SelectGuaranteedSingleRow({
        ...statement,
        selection: parseTableAggregationSelection(aggregation, statement.joins.length+1)
    })
}

