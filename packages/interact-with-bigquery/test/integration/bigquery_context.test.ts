require('dotenv').config()

import {createBigQueryContext} from '../../lib'
import {
    computeBigQueryTestTableName,
    createBigQueryForTests,
    setupBigQueryTestData,
    tearDownBigQueryTestData
} from './bigquery_setup'
import * as chai from 'chai'
import * as chaiAsPromised from 'chai-as-promised'
import {createDatabaseContextTestSuite, defineTable, Employee} from '@fairscript/interact'

describe('BigQuery context', () => {

    const bigQuery = createBigQueryForTests()
    const datasetName = 'testdataset'
    const tableName = computeBigQueryTestTableName('context_tests')

    const ctx = createBigQueryContext(bigQuery, datasetName)
    const suite = createDatabaseContextTestSuite(ctx, defineTable(Employee, tableName))

    before(async() => {
        chai.should()
        chai.use(chaiAsPromised)

        await setupBigQueryTestData(bigQuery, datasetName, tableName)
    })

    it('can get a scalar', () => suite.testScalarQuery())

    describe('can get a vector', () => {
        it('without restrictions', () => suite.testVectorQuery())

        it('with an ordered distinction',  () => suite.testDistinctQuery())
    })

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

    describe('can get multiple rows', () => {
        it(
            'without limit',
            () => suite.testRowQuery())

        it(
            'with a limit',
            () => suite.testLimitedQuery())

        it(
            'with a limited offset',
            () => suite.testLimitedOffsetQuery())
    })

    it(
        'can run queries in parallel',
        () => suite.testParallelQueries())

    after(async() => {
        await tearDownBigQueryTestData(bigQuery, datasetName, tableName)
    })

})