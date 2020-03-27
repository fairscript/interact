import {SelectStatement} from '../../select_statement'
import {SelectSingleRow} from './select_single_row'
import {SelectGenerator} from '../select_generator'

export class SelectRows<T> extends SelectGenerator {
    constructor(statement: SelectStatement) {
        super(statement)
    }

    single(): SelectSingleRow<T> {
        return new SelectSingleRow<T>(this.statement)
    }

    kind = 'row-select-generator'
}