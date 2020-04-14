require('dotenv').config()

import {createPostgresContext} from '../../lib'
import {createPgTestClient, setUpPostgresTestData} from './postgres_setup'
import * as chai from 'chai'
import * as chaiAsPromised from 'chai-as-promised'
import {createPostgresClient} from '../../lib/postgres_client'
import {createDatabaseContextTestSuite} from '@fairscript/interact/lib/test/integration/database_context_test_suite'
import {employees} from '@fairscript/interact/lib/test/test_tables'

describe('Postgres context', () => {

    const pg = createPgTestClient()
    const client = createPostgresClient(pg)
    const ctx = createPostgresContext(client)
    const suite = createDatabaseContextTestSuite(ctx, employees)

    before(async() => {
        chai.should()
        chai.use(chaiAsPromised)

        await pg.connect()

        await setUpPostgresTestData(client)
    })

    it('can get a scalar', () => suite.testScalarQuery())

    describe('can get a vector', () => {
        it('without restrictions', () => suite.testVectorQuery())

        it('with an ordered distinction',  () => suite.testDistinctQuery())
    })

    describe('can get a single row', () => {
        it(
            'without a parameter',
            () => suite.testSingleRowQuery())

        it(
            'with a number parameter',
            () => suite.testSingleRowQueryWithNumberParameter())

        it(
            'with an object parameter',
            () => suite.testSingleRowQueryWithObjectParameter())
    })

    describe('can get multiple rows', () => {
        it(
            'without limit',
            () => suite.testRowQuery())

        it(
            'with a limit',
            () => suite.testLimitedQuery())

        it(
            'with a limited offset',
            () => suite.testLimitedOffsetQuery())
    })

    it(
        'can run queries in parallel',
        () => suite.testParallelQueries())

    after(async() => {
        await pg.end()
    })

})