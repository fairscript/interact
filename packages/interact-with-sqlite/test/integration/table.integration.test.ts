import * as chai from 'chai'
import * as chaiAsPromised from 'chai-as-promised'
import {createSqliteInMemoryClient} from '../../lib/sqlite_client'
import {createSqliteContext} from '../../lib'
import {setUpSqliteTestData} from './sqlite_setup'
import {
    testBooleanEvaluationFilteringIntegration,
    testComparisonFilteringIntegration,
    testConcatenationFilteringIntegration,
    testNegationFilteringIntegration
} from '@fairscript/interact/lib/test/integration/filtering.integration.test'
import {
    testGroupAggregationIntegration,
    testMultiColumnAggregationIntegration,
    testSingleColumnAggregationIntegration
} from '@fairscript/interact/lib/test/integration/aggregation.integration.test'
import {
    testLimitedSelectionIntegration,
    testMapSelectionIntegration, testRowCountSelectionIntegration,
    testSelectionOfAllRowsIntegration,
    testVectorSelectionIntegration,
    testSingleRowSelectionIntegration,
    testScalarSelectionIntegration
} from '@fairscript/interact/lib/test/integration/selection.integration.test'

describe('SqliteContext', () => {
    const client = createSqliteInMemoryClient()
    before(async() => {
        chai.should()
        chai.use(chaiAsPromised)

        await setUpSqliteTestData(client)
    })

    const context = createSqliteContext(client)

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
})