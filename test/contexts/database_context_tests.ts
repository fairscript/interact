import {employees} from '../test_tables'
import {DatabaseContext} from '../../lib/contexts/database_context'
import PromisedAssertion = Chai.PromisedAssertion

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

const rowsQuery = employees.map(e => ({firstName: e.firstName, lastName: e.lastName}))
const expectedRowsResult = [
    { firstName: 'John', lastName: 'Doe'},
    { firstName: 'Richard', lastName: 'Roe'}
]

export function testScalarQuery(ctx: DatabaseContext): PromisedAssertion {
    const promiseOfScalar = ctx
        .get(scalarQuery)

    return promiseOfScalar
        .should.eventually.equal(expectedScalarResult)
}

export function testSingleRowQuery(ctx: DatabaseContext): PromisedAssertion {
    const promiseOfRow: Promise<{ firstName: string; lastName: string }> = ctx
        .get(singleRowQuery)

    return promiseOfRow
        .should.eventually.eql(expectedSingleRowResult)
}

export function testSingleRowQueryWithNumberParameter(ctx: DatabaseContext): PromisedAssertion {
    const promiseOfRow: Promise<{ firstName: string; lastName: string }> = ctx
        .get(singleRowQueryWithNumberParameter)

    return promiseOfRow
        .should.eventually.eql(expectedSingleRowWithNumberParameterResult)
}

export function testSingleRowQueryWithObjectParameter(ctx: DatabaseContext): PromisedAssertion {
    const promiseOfRow: Promise<{ id: number }> = ctx
        .get(singleRowQueryWithObjectParameter)

    return promiseOfRow
        .should.eventually.eql(expectedSingleRowWithObjectParameterResult)
}

export function testRowQuery(ctx: DatabaseContext): PromisedAssertion {
    const promiseOfRows: Promise<{ firstName: string; lastName: string }[]> = ctx
        .get(rowsQuery)

    return promiseOfRows
        .should.eventually.eql(expectedRowsResult)
}

export function testParallelQueries(ctx: DatabaseContext): PromisedAssertion {
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