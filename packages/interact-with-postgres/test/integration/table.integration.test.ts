require('dotenv').config()

import * as chai from 'chai'
import * as chaiAsPromised from 'chai-as-promised'
import {performAggregationIntegrationTests} from '@fairscript/interact/lib/test/integration/aggregation.integration.test'
import {performSelectionIntegrationTest} from '@fairscript/interact/lib/test/integration/selection.integration.test'
import {performFilteringIntegrationTests} from '@fairscript/interact/lib/test/integration/filtering.integration.test'
import {createPgTestClient, setUpPostgresTestData} from './postgres_setup'
import {createPostgresClient} from '../../lib/postgres_client'
import {createPostgresContext} from '../../lib'

describe('PostgresContext', () => {
    const pg = createPgTestClient()
    const client = createPostgresClient(pg)
    const context = createPostgresContext(client)

    before(async() => {
        chai.should()
        chai.use(chaiAsPromised)

        await pg.connect()

        await setUpPostgresTestData(client)
    })

    describe('can select', () => {
        performSelectionIntegrationTest(context)
    })

    describe('can aggregate', () => {
        performAggregationIntegrationTests(context)
    })

    describe('can filter', () => {
        performFilteringIntegrationTests(context)
    })

    after(async() => {
        await pg.end()
    })
})