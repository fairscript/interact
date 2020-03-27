import {SelectStatement} from '../../select_statement'
import {SelectGenerator} from '../select_generator'

export class SelectScalar<T> extends SelectGenerator {
    constructor(statement: SelectStatement) {
        super(statement)
    }

    kind = 'scalar-select-generator'
}