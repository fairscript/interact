import {SelectStatement} from '../../select_statement'

export class SelectSingleRow<T> {
    constructor(public statement: SelectStatement) {}

    kind = 'single-row-select-generator'
}