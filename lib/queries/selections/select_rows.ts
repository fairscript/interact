import {SelectStatement} from '../../select_statement'
import {SelectSingleRow} from './select_single_row'

export class SelectRows<T> {
    constructor(public statement: SelectStatement) {}

    single(): SelectSingleRow<T> {
        return new SelectSingleRow<T>(this.statement)
    }

    kind = 'row-select-generator'
}