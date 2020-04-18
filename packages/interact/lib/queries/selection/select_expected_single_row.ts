import {SelectStatement} from '../../statements/select_statement'
import {Runnable} from '../../databases/database_context'
import {GroupSelectStatement} from '../../statements/group_select_statement'
import {createSingleTableSelection} from '../../parsing/selection/single_table_selection_parsing'

export class SelectExpectedSingleRow<T> implements Runnable<T> {
    constructor(public statement: SelectStatement|GroupSelectStatement) {}

    readonly clientInstruction = 'expect-single-row'
}


export function selectExpectedSingleRow<T>(statement: SelectStatement): SelectExpectedSingleRow<T> {
    return new SelectExpectedSingleRow(
        {
            ...statement,
            selection: createSingleTableSelection(),
            // Limit to two rows to determine if there is more than one row.
            limit: 2
        })
}
