import * as assert from 'assert'
import {sqliteDialect} from '../../lib/sqlite_dialect'
import {Runnable} from '@fairscript/interact/lib/databases/database_context'
import {
    generateSelectStatementParameters,
    generateSelectStatementSql
} from '@fairscript/interact/lib/generation/select_statement_generation'
import {joinWithNewLine} from '@fairscript/interact/lib/join'
import {ValueRecord} from '@fairscript/interact/lib/record'
import {Value} from '@fairscript/interact/lib/value'

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