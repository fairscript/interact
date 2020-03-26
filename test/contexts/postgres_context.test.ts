import {createPgTestClient, setUpPostgresTestData} from '../setup/postgres_setup'

require('dotenv').config()
import {createPostgresContext} from '../../lib/contexts/postgres_context'
import * as chai from 'chai'
import * as chaiAsPromised from 'chai-as-promised'
import {
    testParallelQueries,
    testRowQuery,
    testScalarQuery,
    testSingleRowQuery,
    testSingleRowQueryWithNumberParameter,
    testSingleRowQueryWithObjectParameter
} from './database_context_tests'
import {createPostgresClient} from '../../lib/clients/postgres_client'

describe('Postgres client', () => {

    const pg = createPgTestClient()
    const client = createPostgresClient(pg)
    const ctx = createPostgresContext(client)

    before(async() => {
        chai.should()
        chai.use(chaiAsPromised)

        await pg.connect()

        await setUpPostgresTestData(client)
    })

    it('can get a scalar', () => testScalarQuery(ctx))

    describe('can get a single row', () => {
        it(
            'without a parameter',
            () =>  testSingleRowQuery(ctx))

        it(
            'with a number parameter',
            () => testSingleRowQueryWithNumberParameter(ctx))

        it(
            'with an object parameter',
            () => testSingleRowQueryWithObjectParameter(ctx))
    })

    it(
        'can get multiple rows',
        () => testRowQuery(ctx))

    it(
        'can run queries in parallel',
        () => testParallelQueries(ctx))

    after(async() => {
        await pg.end()
    })

})