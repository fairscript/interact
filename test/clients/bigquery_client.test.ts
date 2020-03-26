import {BigQueryClient, createBigQueryClient} from '../../lib/clients/bigquery_client'

require('dotenv').config()
import * as assert from 'assert'
import {
    createBigQueryForTests,
    computeBigQueryTestTableName,
    setupBigQueryTestData,
    tearDownBigQueryTestData
} from '../setup/bigquery_setup'

describe('BigQueryClient', () => {

    const bigQuery = createBigQueryForTests()
    const datasetId = 'testdataset'
    const tableName = computeBigQueryTestTableName('client_tests')

    const client = createBigQueryClient(bigQuery, datasetId)

    before(async() => {
        await setupBigQueryTestData(bigQuery, datasetId, tableName)
    })

    it('can get a scalar', async() => {
        const count = await client.getScalar(
            `
                SELECT COUNT(*)
                FROM ${tableName};
            `,
            {})

        assert.equal(count, 2)
    })

    it('can get a single row', async() => {
        const row = await client.getSingleRow(
            `
                SELECT first_name AS firstName, last_name AS lastName
                FROM ${tableName}
                WHERE id = 1;
            `,
            {})

        assert.deepEqual(row, { firstName: 'John', lastName: 'Doe'})
    })

    it('can get multiple rows', async() => {
        const rows = await client.getRows(
            `
                SELECT first_name AS firstName, last_name AS lastName
                FROM ${tableName}
                ORDER BY id ASC
            `,
            {})

        assert.deepEqual(
            rows,
            [
                { firstName: 'John', lastName: 'Doe'},
                { firstName: 'Richard', lastName: 'Roe'}
            ])
    })

    after(async() => {
        await tearDownBigQueryTestData(bigQuery, datasetId, tableName)
    })

})