import * as assert from 'assert'
import {joinWithNewLine} from '../../lib/parsing/parsing_helpers'
import {sqliteDialect} from '../../lib/databases/sqlite/sqlite_dialect'
import {
    generateSelectStatementParameters,
    generateSelectStatementSql
} from '../../lib/generation/select_statement_generation'
import {Runnable} from '../../lib/databases/database_context'
import {ValueRecord} from '../../lib/record'
import {Value} from '../../lib/value'

export function checkSql<T>(
    select: Runnable<T>,
    expectedLines: string[]) {

    const actualSql = generateSelectStatementSql(sqliteDialect, select.statement)
    const expectedSql = joinWithNewLine(expectedLines)

    assert.equal(actualSql, expectedSql)
}


export function checkParameters<T>(
    select: Runnable<T>,
    expectedParameters: Value|ValueRecord) {

    const actualParameters = generateSelectStatementParameters(sqliteDialect, select.statement)

    assert.deepEqual(actualParameters, expectedParameters)
}

export function checkSqlAndParameters<T>(
    select: Runnable<T>,
    expectedLines: string[],
    expectedParameters: Value|ValueRecord) {

    checkSql(select, expectedLines)
    checkParameters(select, expectedParameters)
}