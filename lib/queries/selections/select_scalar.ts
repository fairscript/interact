import {SelectStatement} from '../../select_statement'

export class SelectScalar<T> {
    constructor(public statement: SelectStatement) {}

    kind = 'scalar-select-generator'
}