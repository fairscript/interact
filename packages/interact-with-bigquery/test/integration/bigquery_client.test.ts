require('dotenv').config()

import * as chai from 'chai'
import * as chaiAsPromised from 'chai-as-promised'
import {BigQueryClient, createBigQueryClient} from '../../lib/bigquery_client'
import {
    createBigQueryForTests,
    computeBigQueryTestTableName,
    setUpBigQueryTestData,
    tearDownBigQueryTestData
} from './bigquery_setup'
import {createDatabaseClientTestSuite} from '@fairscript/interact/lib/test/integration/database_client_test_suite'

describe('BigQueryClient', () => {

    const bigQuery = createBigQueryForTests()
    const datasetId = 'testdataset'

    const dataset = bigQuery.dataset(datasetId)
    const tableName = computeBigQueryTestTableName('client_tests', 'employees')

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

        await setUpBigQueryTestData(dataset, tableName)
    })

    it('can get a scalar', () => suite.testScalar())

    it('can get a single row', () => suite.testSingleRow())

    it('can get a vector', () => suite.testVector())

    it('can get multiple rows', () => suite.testRows())

    after(async() => {
        await tearDownBigQueryTestData(dataset, tableName)
    })

})