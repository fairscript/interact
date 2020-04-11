import {Table} from '../../queries/one/table'
import {DatabaseContext, Employee} from '../..'
import {testEmployees} from '../test_tables'

export function createDatabaseContextTestSuite(ctx: DatabaseContext, employees: Table<Employee>) {
    const scalarQuery = employees.count()
    const expectedScalarResult = testEmployees.length

    const vectorQuery = employees.sortBy(e => e.id).get(e => e.title)
    const expectedVectorResult = testEmployees.map(e => e.title)

    const singleRowQuery = employees
        .filter(e => e.id === 1)
        .map(e => ({firstName: e.firstName, lastName: e.lastName}))
        .single()
    const firstEmployee = testEmployees.find(e => e.id === 1)!
    const expectedSingleRowResult = { firstName: firstEmployee.firstName, lastName: firstEmployee.lastName }

    const rowsQuery = employees.sortBy(e => e.id).map(e => ({firstName: e.firstName, lastName: e.lastName}))
    const expectedRowsResult = testEmployees.map(e =>({ firstName: e.firstName, lastName: e.lastName }))

    return {
        testScalarQuery: () => {
            const promiseOfScalar: Promise<number> = ctx
                .run(scalarQuery)

            return promiseOfScalar
                .should.eventually.equal(expectedScalarResult)
        },

        testVectorQuery: () => {
            const promiseOfVector: Promise<string[]> = ctx
                .run(vectorQuery)

            return promiseOfVector
                .should.eventually.eql(expectedVectorResult)
        },

        testSingleRowQuery: () => {
            const promiseOfRow: Promise<{ firstName: string; lastName: string }> = ctx
                .run(singleRowQuery)

            return promiseOfRow
                .should.eventually.eql(expectedSingleRowResult)
        },

        testSingleRowQueryWithNumberParameter: () => {
            const promiseOfRow: Promise<{ firstName: string; lastName: string }> = ctx
                .run(employees
                    .filter(
                        1,
                        (id, e) => e.id === id
                    )
                    .map(e => ({firstName: e.firstName, lastName: e.lastName}))
                    .single()
                )

            return promiseOfRow
                .should.eventually.eql(expectedSingleRowResult)
        },

        testSingleRowQueryWithObjectParameter: () => {
            const singleRowQueryWithObjectParameter = employees
                .filter(
                    {firstName: 'John', lastName: 'Doe'},
                    (name, e) => e.firstName === name.firstName && e.lastName === name.lastName)
                .map(e => ({id: e.id}))
                .single()

            const promiseOfRow: Promise<{ id: number }> = ctx
                .run(singleRowQueryWithObjectParameter)

            return promiseOfRow
                .should.eventually.eql({ id: testEmployees.find(e => e.firstName === 'John' && e.lastName === 'Doe')!.id })
        },

        testRowQuery: () => {
            const promiseOfRows: Promise<{ firstName: string; lastName: string }[]> = ctx
                .run(rowsQuery)

            return promiseOfRows
                .should.eventually.eql(expectedRowsResult)
        },

        testLimitedQuery: () => {
            const promiseOfRows: Promise<{ firstName: string; lastName: string }[]> = ctx.run(rowsQuery.limit(2))

            return promiseOfRows
                .should.eventually.eql(testEmployees.slice(0, 2).map(e => ({firstName: e.firstName, lastName: e.lastName})))
        },

        testLimitedOffsetQuery: () => {
            const promiseOfRows: Promise<{ firstName: string; lastName: string }[]> = ctx.run(rowsQuery.limit(1).offset(1))

            return promiseOfRows
                .should.eventually.eql(testEmployees.slice(1, 2).map(e => ({firstName: e.firstName, lastName: e.lastName})))
        },

        testDistinctQuery: () => {
            const promiseOfRows: Promise<{ firstName: string; lastName: string }[]> = ctx
                .run(employees.sortBy(e => e.id).get(e => e.title).distinct())

            const allTitles = testEmployees
                .map(e => e.title)

            const uniqueTitles = allTitles
                .filter((item, pos) => allTitles.indexOf(item) === pos)

            return promiseOfRows.should.eventually.eql(uniqueTitles)
        },

        testParallelQueries: () => {
            return ctx
                .parallelRun({
                    scalar: scalarQuery,
                    vector: vectorQuery,
                    singleRow: singleRowQuery,
                    rows: rowsQuery
                })
                .should.eventually.eql({
                    scalar: expectedScalarResult,
                    vector: expectedVectorResult,
                    singleRow: expectedSingleRowResult,
                    rows: expectedRowsResult
                })
        }
    }
}