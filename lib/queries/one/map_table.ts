import {SelectStatement} from '../../select_statement'
import {parseMap} from '../../parsing/map_parsing'
import {SelectSqlGenerator} from '../../sql_generation'
import {StringValueRecord} from '../../record'

export class MapTable<T, U extends StringValueRecord> extends SelectSqlGenerator {
    constructor(existingStatement: SelectStatement, map: (table: T) => U) {
        super({
            ...existingStatement,
            selection: parseMap(map)
        })
    }
}