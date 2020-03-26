import * as assert from 'assert'
import {SelectGenerator} from '../../lib/queries/select_generators'
import {joinWithNewLine} from '../../lib/parsing/parsing_helpers'
import {sqliteDialect} from '../../lib/databases/sqlite/sqlite_dialect'

export function checkSql<T>(generator: SelectGenerator<T>, lines: string[]) {
    const actualSql = generator.toSql(sqliteDialect)[0]
    const expectedSql = joinWithNewLine(lines)

    assert.equal(actualSql, expectedSql)
}