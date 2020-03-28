require('dotenv').config()
import * as chai from 'chai'
import * as chaiAsPromised from 'chai-as-promised'
import {BigQueryClient, createBigQueryClient} from '../../../lib/databases/bigquery/bigquery_client'
import {
    createBigQueryForTests,
    computeBigQueryTestTableName,
    setupBigQueryTestData,
    tearDownBigQueryTestData
} from './bigquery_setup'
import {createDatabaseClientTestSuite} from '../database_client_test_suite'

describe('BigQueryClient', () => {

    const bigQuery = createBigQueryForTests()
    const datasetId = 'testdataset'
    const tableName = computeBigQueryTestTableName('client_tests')

    const client = createBigQueryClient(bigQuery, datasetId)

    const suite = createDatabaseClientTestSuite(
        client,
        `SELECT COUNT(*) FROM ${tableName}`,
        `
            SELECT first_name AS firstName, last_name AS lastName
            FROM ${tableName}
            WHERE id = 1
        `,
        `SELECT title FROM ${tableName} ORDER BY id ASC`,
        `
            SELECT first_name AS firstName, last_name AS lastName
            FROM ${tableName}
            ORDER BY id ASC
        `)

    before(async() => {
        chai.should()
        chai.use(chaiAsPromised)

        await setupBigQueryTestData(bigQuery, datasetId, tableName)
    })

    it('can get a scalar', () => suite.testScalar())

    it('can get a single row', () => suite.testSingleRow())

    it('can get a vector', () => suite.testVector())

    it('can get multiple rows', () => suite.testRows())

    after(async() => {
        await tearDownBigQueryTestData(bigQuery, datasetId, tableName)
    })

})