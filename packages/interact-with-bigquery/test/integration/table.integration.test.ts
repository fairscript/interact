require('dotenv').config()

import {
    computeBigQueryTestTableName,
    createBigQueryForTests,
    setUpBigQueryTestData,
    tearDownBigQueryTestData
} from './bigquery_setup'

import {AggregationIntegrationTestSuite} from '@fairscript/interact/lib/test/integration/aggregation_integration_test_suite'
import {FilteringIntegrationTestSuite} from '@fairscript/interact/lib/test/integration/filtering_integration_test_suite'
import {SelectionIntegrationTestSuite} from '@fairscript/interact/lib/test/integration/selection_integration_test_suite'
import {SubqueryIntegrationTestSuite} from '@fairscript/interact/lib/test/integration/subquery_integration_test_suite'
import {defineDepartmentsTable, defineEmployeesTable, employees} from '@fairscript/interact/lib/test/test_tables'
import * as chai from 'chai'
import * as chaiAsPromised from 'chai-as-promised'
import {createBigQueryContext} from '../../lib'

describe('BigQueryContext', () => {
    const bigQuery = createBigQueryForTests()
    const datasetName = 'testdataset'
    const dataset = bigQuery.dataset(datasetName)

    const tableNamePrefix = 'integration_tests'

    const employeesTableName = computeBigQueryTestTableName(tableNamePrefix, 'employees')
    const employeesTable = defineEmployeesTable(employeesTableName)

    const departmentsTableName = computeBigQueryTestTableName(tableNamePrefix, 'departments')
    const departmentsTable = defineDepartmentsTable(departmentsTableName)

    const context = createBigQueryContext(bigQuery, datasetName)

    before(async() => {
        chai.should()
        chai.use(chaiAsPromised)

        await setUpBigQueryTestData(dataset, employeesTableName, departmentsTableName)
    })

    describe('can select', () => {
        const selectionTestSuite = new SelectionIntegrationTestSuite(context, employeesTable, departmentsTable)

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
        const aggregationTestSuite = new AggregationIntegrationTestSuite(context, employeesTable)

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
        const filteringTestSuite = new FilteringIntegrationTestSuite(context, employeesTable)

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
        const subqueryTestSuite = new SubqueryIntegrationTestSuite(context, employeesTable)

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
        await tearDownBigQueryTestData(dataset, employeesTableName, departmentsTableName)
    })
})