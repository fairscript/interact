import * as chai from 'chai'
import * as chaiAsPromised from 'chai-as-promised'
import {createSqliteInMemoryClient} from '../../lib/sqlite_client'
import {createSqliteContext} from '../../lib'
import {setUpSqliteTestData} from './sqlite_setup'
import {performSelectionIntegrationTest} from '@fairscript/interact/lib/test/integration/selection.integration.test'
import {performAggregationIntegrationTests} from '@fairscript/interact/lib/test/integration/aggregation.integration.test'
import {performFilteringIntegrationTests} from '@fairscript/interact/lib/test/integration/filtering.integration.test'

describe('SqliteContext', () => {
    const client = createSqliteInMemoryClient()
    before(async() => {
        chai.should()
        chai.use(chaiAsPromised)

        await setUpSqliteTestData(client)
    })

    const context = createSqliteContext(client)

    describe('can select', () => {
        performSelectionIntegrationTest(context)
    })

    describe('can aggregate', () => {
        performAggregationIntegrationTests(context)
    })

    describe('can filter', () => {
        performFilteringIntegrationTests(context)
    })
})