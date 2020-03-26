require('dotenv').config()

import {createPgTestClient, setUpPostgresTestData} from './postgres_setup'
import {createPostgresContext} from '../../../lib/databases/postgres/postgres_context'
import * as chai from 'chai'
import * as chaiAsPromised from 'chai-as-promised'
import {createDatabaseContextTestSuite} from '../database_context_test_suite'
import {createPostgresClient} from '../../../lib/databases/postgres/postgres_client'
import {employees} from '../../test_tables'

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

    it(
        'can get multiple rows',
        () => suite.testRowQuery())

    it(
        'can run queries in parallel',
        () => suite.testParallelQueries())

    after(async() => {
        await pg.end()
    })

})