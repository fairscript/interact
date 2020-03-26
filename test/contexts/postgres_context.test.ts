require('dotenv').config()
import {createPostgresContext} from '../../lib/contexts/postgres_context'
import * as chai from 'chai'
import * as chaiAsPromised from 'chai-as-promised'
import {createPgTestClient, setupPostgresTestData} from '../clients/db_test_setup'
import {testScalarQuery} from './database_context_tests'
import {createPostgresClient} from '../../lib/clients/postgres_client'

describe('Postgres client', () => {

    const pg = createPgTestClient()
    const client = createPostgresClient(pg)
    const ctx = createPostgresContext(client)

    before(async() => {
        chai.should()
        chai.use(chaiAsPromised)

        await pg.connect()

        await setupPostgresTestData(client)
    })

    it('can get a scalar', () => testScalarQuery(ctx))

    after(async() => {
        await pg.end()
    })
})