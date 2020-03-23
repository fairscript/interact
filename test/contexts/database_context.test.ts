import * as sqlite3 from 'sqlite3'
import * as chai from 'chai'
import * as chaiAsPromised from 'chai-as-promised'
import {createEmployeesTableSql, employees, insertEmployeeSql} from '../test_tables'
import {createSqliteInMemoryClient} from '../../lib/contexts/sqlite_client'
import {createSqliteContext} from '../../lib'

describe('DatabaseContext', () => {

    const dbClient = createSqliteInMemoryClient()
    const ctx = createSqliteContext(dbClient)

    const scalarQuery = employees.count()
    const singleRowQuery = employees
        .filter(e => e.id === 1)
        .map(e => ({firstName: e.firstName, lastName: e.lastName}))
        .single()
    const rowsQuery = employees.map(e => ({firstName: e.firstName, lastName: e.lastName}))

    const expectedScalarResult = 2
    const expectedSingleRowResult = { firstName: 'John', lastName: 'Doe'}
    const expectedRowsResult = [
        { firstName: 'John', lastName: 'Doe'},
        { firstName: 'Richard', lastName: 'Roe'}
    ]

    before(async() => {
        chai.should()
        chai.use(chaiAsPromised)
        sqlite3.verbose()

        await dbClient.run(createEmployeesTableSql)

        await dbClient.runBatch(
            insertEmployeeSql,
            [
                ['John', 'Doe', 'CEO', 10_000, 1],
                ['Richard', 'Roe', 'CFO', 8_000, 1]
            ])
    })

    it('can get a scalar', () => {
        const promiseOfScalar: Promise<number> = ctx
            .get(scalarQuery)

        return promiseOfScalar
            .should.eventually.equal(expectedScalarResult)
    })

    it('can get a single row', () => {
        const promiseOfRow: Promise<{ firstName: string; lastName: string }> = ctx
            .get(singleRowQuery)

        return promiseOfRow
            .should.eventually.eql(expectedSingleRowResult)
    })

    it('can get multiple rows', () => {
        const promiseOfRows: Promise<{ firstName: string; lastName: string }[]> = ctx
            .get(rowsQuery)

        return promiseOfRows
            .should.eventually.eql(expectedRowsResult)
    })

    it('can run queries in parallel', () => {
        return ctx
            .parallelGet({
                scalar: scalarQuery,
                singleRow: singleRowQuery,
                rows: rowsQuery
            })
            .should.eventually.eql({
                scalar: expectedScalarResult,
                singleRow: expectedSingleRowResult,
                rows: expectedRowsResult
            })
    })
})