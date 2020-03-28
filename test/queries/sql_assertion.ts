import * as assert from 'assert'
import {joinWithNewLine} from '../../lib/parsing/parsing_helpers'
import {sqliteDialect} from '../../lib/databases/sqlite/sqlite_dialect'
import {SelectScalar} from '../../lib/queries/selection/select_scalar'
import {SelectSingleRow} from '../../lib/queries/selection/select_single_row'
import {SelectRows} from '../../lib/queries/selection/select_rows'
import {generateSelectStatementSql} from '../../lib/generation/select_statement_generation'
import {Runnable} from '../../lib/databases/database_context'

export function checkSql<T>(
    select: Runnable<T>,
    lines: string[]) {

    const actualSql = generateSelectStatementSql(sqliteDialect, select.statement)
    const expectedSql = joinWithNewLine(lines)

    assert.equal(actualSql, expectedSql)
}