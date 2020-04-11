import * as assert from 'assert'
import {
    generateSelectStatementParameters,
    generateSelectStatementSql,
    joinWithNewLine,
    Runnable,
    Value,
    ValueRecord
} from '@fairscript/interact'
import {sqliteDialect} from '../../lib/sqlite_dialect'

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