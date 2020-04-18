require('dotenv').config()

import * as chai from 'chai'
import * as chaiAsPromised from 'chai-as-promised'
import {
    testGroupAggregationIntegration, testMultiColumnAggregationIntegration,
    testSingleColumnAggregationIntegration
} from '@fairscript/interact/lib/test/integration/aggregation.integration.test'
import {
    testLimitedSelectionIntegration,
    testMapSelectionIntegration,
    testRowCountSelectionIntegration,
    testScalarSelectionIntegration,
    testSelectionOfAllRowsIntegration,
    testSingleRowSelectionIntegration,
    testVectorSelectionIntegration
} from '@fairscript/interact/lib/test/integration/selection.integration.test'
import {
    testBooleanEvaluationFilteringIntegration,
    testComparisonFilteringIntegration,
    testConcatenationFilteringIntegration,
    testNegationFilteringIntegration
} from '@fairscript/interact/lib/test/integration/filtering.integration.test'
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
        describe('all rows', () => {
            testSelectionOfAllRowsIntegration(context)
        })

        describe('a limited number of rows', () => {
            testLimitedSelectionIntegration(context)
        })

        describe('a single row', () => {
            testSingleRowSelectionIntegration(context)
        })

        it('can map rows', () => {
            return testMapSelectionIntegration(context)
        })

        describe('a single column', () => {
            testVectorSelectionIntegration(context)
        })

        it('a scalar', () => {
            return testScalarSelectionIntegration(context)
        })

        it('the row count', () => {
            return testRowCountSelectionIntegration(context)
        })
    })

    describe('can aggregate', () => {
        describe('a single column', () => {
            testSingleColumnAggregationIntegration(context)
        })

        it('multiple columns', () => {
            return testMultiColumnAggregationIntegration(context)
        })

        it('groups', () => {
            return testGroupAggregationIntegration(context)
        })
    })

    describe('can filter', () => {
        describe('by evaluating', () => {
            testBooleanEvaluationFilteringIntegration(context)
        })

        describe('using a comparison', () => {
            testComparisonFilteringIntegration(context)
        })

        describe('by negating', () => {
            testNegationFilteringIntegration(context)
        })

        describe('using a concatenation of comparisons', () => {
            testConcatenationFilteringIntegration(context)
        })
    })

    after(async() => {
        await pg.end()
    })
})