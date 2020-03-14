import {SelectStatement} from '../../select_statement'
import {parseGetKey} from '../../parsing/get_key_parsing'

export class GroupTwoTables<T1, T2, K> {
    private readonly statement: SelectStatement

    constructor(
        existingStatement: SelectStatement,
        getKey: (first: T1, second: T2) => K) {

        this.statement = {
            ...existingStatement,
            key: parseGetKey(getKey)
        }
    }
}