import {parseMultipleTableSelection} from '../../parsing/selection/multi_table_selection_parsing'
import {Runnable} from '../../databases/database_context'
import {SelectStatement} from '../../statements/select_statement'

export class SelectExpectedSetOfRows<T> implements Runnable<T[]> {
    constructor(public statement: SelectStatement) {}

    readonly clientInstruction = 'expect-set-of-rows'
}

export function selectExpectedSetOfRows<Ts>(
    statement: SelectStatement,
    nameAndConstructorPairs: [string, Function][]): SelectExpectedSetOfRows<Ts> {

    return new SelectExpectedSetOfRows(
        {
            ...statement,
            selection: parseMultipleTableSelection(nameAndConstructorPairs)
        })
}
