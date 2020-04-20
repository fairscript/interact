require('dotenv').config()

import {departments, employees} from '@fairscript/interact/lib/test/test_tables'

import {AggregationIntegrationTestSuite} from '@fairscript/interact/lib/test/integration/aggregation_integration_test_suite'
import {FilteringIntegrationTestSuite} from '@fairscript/interact/lib/test/integration/filtering_integration_test_suite'
import {SelectionIntegrationTestSuite} from '@fairscript/interact/lib/test/integration/selection_integration_test_suite'
import {SubqueryIntegrationTestSuite} from '@fairscript/interact/lib/test/integration/subquery_integration_test_suite'
import * as chai from 'chai'
import * as chaiAsPromised from 'chai-as-promised'
import {createPgTestClient, setUpPostgresTestData} from './postgres_setup'
import {createPostgresClient} from '../../lib/postgres_client'
import {createPostgresContext} from '../../lib'

describe('PostgresContext', () => {
    const pg = createPgTestClient()
    const client = createPostgresClient(pg)
    const context = createPostgresContext(pg)

    before(async() => {
        chai.should()
        chai.use(chaiAsPromised)

        await pg.connect()

        await setUpPostgresTestData(client)
    })

    describe('can select', () => {
        const selectionTestSuite = new SelectionIntegrationTestSuite(context, employees, departments)

        describe('all rows', () => {
            selectionTestSuite.testSelectionOfAllRows()
        })

        describe('a limited number of rows', () => {
            selectionTestSuite.testLimitedSelection()
        })

        describe('a single row', () => {
            selectionTestSuite.testSingleRowSelection()
        })

        it('can map rows', () => {
            return selectionTestSuite.testMapSelection()
        })

        describe('a single column', () => {
            selectionTestSuite.testVectorSelection()
        })

        it('a scalar', () => {
            return selectionTestSuite.testScalarSelection()
        })

        it('the row count', () => {
            return selectionTestSuite.testRowCountSelection()
        })
    })

    describe('can aggregate', () => {
        const aggregationTestSuite = new AggregationIntegrationTestSuite(context, employees)

        describe('a single numeric column', () => {
            aggregationTestSuite.testNumericColumnAggregation()
        })

        describe('a single Boolean column', () => {
            aggregationTestSuite.testBooleanColumnAggregation()
        })

        it('multiple columns', () => {
            return aggregationTestSuite.testMultiColumnAggregation()
        })

        it('groups', () => {
            return aggregationTestSuite.testGroupAggregation()
        })
    })

    describe('can filter', () => {
        const filteringTestSuite = new FilteringIntegrationTestSuite(context, employees)

        describe('by evaluating', () => {
            filteringTestSuite.testBooleanEvaluationFiltering()
        })

        describe('using a comparison', () => {
            filteringTestSuite.testComparisonFiltering()
        })

        describe('by negating', () => {
            filteringTestSuite.testNegationFiltering()
        })

        describe('using a concatenation of comparisons', () => {
            filteringTestSuite.testConcatenationFiltering()
        })
    })

    describe('can subquery', () => {
        const subqueryTestSuite = new SubqueryIntegrationTestSuite(context, employees)

        it('a count', () => {
            return subqueryTestSuite.testCounting()
        })

        it('a maximum', () => {
            return subqueryTestSuite.testMaximization()
        })

        it('a minimum', () => {
            return subqueryTestSuite.testMinimization()
        })

        it('a sum', () => {
            return subqueryTestSuite.testSum()
        })

        it('an average', () => {
            return subqueryTestSuite.testAverage()
        })
    })

    after(async() => {
        await pg.end()
    })
})