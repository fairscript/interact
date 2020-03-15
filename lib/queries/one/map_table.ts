import {SelectStatement} from '../../select_statement'
import {parseMap} from '../../parsing/map_parsing'
import {SelectSqlGenerator} from '../../sql_generation'
import {Value} from '../../column_operations'

export class MapTable<T, U extends Record<string, Value>> extends SelectSqlGenerator {
    constructor(existingStatement: SelectStatement, map: (table: T) => U) {
        super({
            ...existingStatement,
            selection: parseMap(map)
        })
    }
}