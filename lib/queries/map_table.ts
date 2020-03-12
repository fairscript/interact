import {SelectStatement} from '../select_statement'
import {SelectSqlGenerator} from '../sql_generation'
import {parseMap} from '../parsing/map_parsing'

export class MapTable<T, U> extends SelectSqlGenerator {
    constructor(existingStatement: SelectStatement, map: (x: T) => U) {
        super({
                ...existingStatement,
                selection: parseMap(map)
            }
        )
    }
}