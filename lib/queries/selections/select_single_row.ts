import {SelectStatement} from '../../select_statement'
import {SelectGenerator} from '../select_generator'

export class SelectSingleRow<T> extends SelectGenerator {
    constructor(statement: SelectStatement) {
        super(statement)
    }

    kind = 'single-row-select-generator'
}