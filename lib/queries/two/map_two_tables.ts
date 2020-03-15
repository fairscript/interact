import {SelectStatement} from '../../select_statement'
import {SelectSqlGenerator} from '../../sql_generation'
import {parseMap} from '../../parsing/map_parsing'
import {StringValueRecord} from '../../record'

export class MapTwoTables<T1, T2, U extends StringValueRecord> extends SelectSqlGenerator {
    constructor(existingStatement: SelectStatement, f: (first: T1, second: T2) => U) {
        super({
                ...existingStatement,
                selection: parseMap(f)
            }
        )
    }
}