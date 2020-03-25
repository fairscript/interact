import * as sqlite3 from 'sqlite3'
import * as chai from 'chai'
import * as chaiAsPromised from 'chai-as-promised'
import {createSqliteInMemoryClient} from '../../lib/contexts/sqlite_client'
import {createSqliteContext} from '../../lib'
import {employees} from '../test_tables'
import {sqliteSetup} from './db_test_setup'

describe('DatabaseContext', () => {

    const dbClient = createSqliteInMemoryClient()
    const ctx = createSqliteContext(dbClient)

    const scalarQuery = employees.count()
    const singleRowQuery = employees
        .filter(e => e.id === 1)
        .map(e => ({firstName: e.firstName, lastName: e.lastName}))
        .single()
    const singleRowQueryUsingNumberParameter = employees
        .filterP(
            1,
            (id, e) => e.id === id
        )
        .map(e => ({firstName: e.firstName, lastName: e.lastName}))
        .single()
    const singleRowQueryUsingObjectParameter = employees
        .filterP(
            {firstName: 'John', lastName: 'Doe'},
            (name, e) => e.firstName === name.firstName && e.lastName === name.lastName)
        .map(e => ({id: e.id}))
        .single()
    const rowsQuery = employees.map(e => ({firstName: e.firstName, lastName: e.lastName}))

    const expectedScalarResult = 2
    const expectedSingleRowResult = { firstName: 'John', lastName: 'Doe'}
    const expectedSingleRowUsingNumberParameterResult = { firstName: 'John', lastName: 'Doe'}
    const expectedSingleRowUsingObjectParameterResult = { id: 1 }
    const expectedRowsResult = [
        { firstName: 'John', lastName: 'Doe'},
        { firstName: 'Richard', lastName: 'Roe'}
    ]

    before(async() => {
        chai.should()
        chai.use(chaiAsPromised)
        sqlite3.verbose()

        await dbClient.run(sqliteSetup.createEmployeesTable)

        await dbClient.runBatch(
            sqliteSetup.insertIntoEmployees,
            [
                ['John', 'Doe', 'CEO', 10_000, 1],
                ['Richard', 'Roe', 'CFO', 8_000, 1]
            ])
    })

    it('can get a scalar', () => {
        const promiseOfScalar = ctx
            .get(scalarQuery)

        return promiseOfScalar
            .should.eventually.equal(expectedScalarResult)
    })

    describe('can get a single row', function () {

        it('without a parameter', () => {
            const promiseOfRow: Promise<{ firstName: string; lastName: string }> = ctx
                .get(singleRowQuery)

            return promiseOfRow
                .should.eventually.eql(expectedSingleRowResult)
        })

        it('with a number parameter', () => {
            const promiseOfRow: Promise<{ firstName: string; lastName: string }> = ctx
                .get(singleRowQueryUsingNumberParameter)

            return promiseOfRow
                .should.eventually.eql(expectedSingleRowUsingNumberParameterResult)
        })

        it('with an object parameter', () => {
            const promiseOfRow: Promise<{ id: number }> = ctx
                .get(singleRowQueryUsingObjectParameter)

            return promiseOfRow
                .should.eventually.eql(expectedSingleRowUsingObjectParameterResult)
        })
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
                singleRowUsingNumberParameter: singleRowQueryUsingNumberParameter,
                singleRowUsingObjectParameter: singleRowQueryUsingObjectParameter,
                rows: rowsQuery
            })
            .should.eventually.eql({
                scalar: expectedScalarResult,
                singleRow: expectedSingleRowResult,
                singleRowUsingNumberParameter: expectedSingleRowUsingNumberParameterResult,
                singleRowUsingObjectParameter: expectedSingleRowUsingObjectParameterResult,
                rows: expectedRowsResult
            })
    })
})