import {Employee} from '../test_tables'
import {DatabaseContext} from '../../lib/databases/database_context'
import {Table} from '../../lib/queries/one/table'

export function createDatabaseContextTestSuite(ctx: DatabaseContext, employees: Table<Employee>) {
    const scalarQuery = employees.count()
    const expectedScalarResult = 2

    const singleRowQuery = employees
        .filter(e => e.id === 1)
        .map(e => ({firstName: e.firstName, lastName: e.lastName}))
        .single()
    const expectedSingleRowResult = { firstName: 'John', lastName: 'Doe'}

    const singleRowQueryWithNumberParameter = employees
        .filterP(
            1,
            (id, e) => e.id === id
        )
        .map(e => ({firstName: e.firstName, lastName: e.lastName}))
        .single()
    const expectedSingleRowWithNumberParameterResult = { firstName: 'John', lastName: 'Doe'}

    const singleRowQueryWithObjectParameter = employees
        .filterP(
            {firstName: 'John', lastName: 'Doe'},
            (name, e) => e.firstName === name.firstName && e.lastName === name.lastName)
        .map(e => ({id: e.id}))
        .single()
    const expectedSingleRowWithObjectParameterResult = { id: 1 }

    const rowsQuery = employees.sortBy(e => e.id).map(e => ({firstName: e.firstName, lastName: e.lastName}))
    const expectedRowsResult = [
        { firstName: 'John', lastName: 'Doe'},
        { firstName: 'Richard', lastName: 'Roe'}
    ]

    return {
        testScalarQuery: () => {
            const promiseOfScalar = ctx
                .get(scalarQuery)

            return promiseOfScalar
                .should.eventually.equal(expectedScalarResult)
        },

        testSingleRowQuery: () => {
            const promiseOfRow: Promise<{ firstName: string; lastName: string }> = ctx
                .get(singleRowQuery)

            return promiseOfRow
                .should.eventually.eql(expectedSingleRowResult)
        },

        testSingleRowQueryWithNumberParameter: () => {
            const promiseOfRow: Promise<{ firstName: string; lastName: string }> = ctx
                .get(singleRowQueryWithNumberParameter)

            return promiseOfRow
                .should.eventually.eql(expectedSingleRowWithNumberParameterResult)
        },

        testSingleRowQueryWithObjectParameter: () => {
            const promiseOfRow: Promise<{ id: number }> = ctx
                .get(singleRowQueryWithObjectParameter)

            return promiseOfRow
                .should.eventually.eql(expectedSingleRowWithObjectParameterResult)
        },

        testRowQuery: () => {
            const promiseOfRows: Promise<{ firstName: string; lastName: string }[]> = ctx
                .get(rowsQuery)

            return promiseOfRows
                .should.eventually.eql(expectedRowsResult)
        },

        testParallelQueries: () => {
            return ctx
                .parallelGet({
                    scalar: scalarQuery,
                    singleRow: singleRowQuery,
                    singleRowUsingNumberParameter: singleRowQueryWithNumberParameter,
                    singleRowUsingObjectParameter: singleRowQueryWithObjectParameter,
                    rows: rowsQuery
                })
                .should.eventually.eql({
                    scalar: expectedScalarResult,
                    singleRow: expectedSingleRowResult,
                    singleRowUsingNumberParameter: expectedSingleRowWithNumberParameterResult,
                    singleRowUsingObjectParameter: expectedSingleRowWithObjectParameterResult,
                    rows: expectedRowsResult
                })
        }
    }
}