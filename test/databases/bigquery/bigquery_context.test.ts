require('dotenv').config()

import {createDatabaseContextTestSuite} from '../database_context_test_suite'
import {
    computeBigQueryTestTableName,
    createBigQueryForTests,
    setupBigQueryTestData,
    tearDownBigQueryTestData
} from './bigquery_setup'
import {createBigQueryContext} from '../../../lib/databases/bigquery/bigquery_context'
import {Employee} from '../../test_tables'
import * as chai from 'chai'
import * as chaiAsPromised from 'chai-as-promised'
import {defineTable} from '../../../lib'

describe('BigQuery context', () => {

    const bigQuery = createBigQueryForTests()
    const datasetName = 'testdataset'
    const tableName = computeBigQueryTestTableName('context_tests')

    const ctx = createBigQueryContext(bigQuery, datasetName)
    const suite = createDatabaseContextTestSuite(
        ctx,
        defineTable(Employee, tableName))

    before(async() => {
        chai.should()
        chai.use(chaiAsPromised)

        await setupBigQueryTestData(bigQuery, datasetName, tableName)
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
        await tearDownBigQueryTestData(bigQuery, datasetName, tableName)
    })

})