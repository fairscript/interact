import {BigQueryClient} from '../../lib/clients/bigquery_client'

require('dotenv').config()
import * as assert from 'assert'
import {
    createBigQueryTestClient,
    computeBigQueryTestTableName,
    setupBigQueryTestData,
    tearDownBigQuery
} from '../setup/bigquery_setup'

describe('BigQueryClient', () => {

    const bigQuery = createBigQueryTestClient()
    const datasetName = 'testdataset'
    const tableName = computeBigQueryTestTableName()

    const client = new BigQueryClient(bigQuery)

    before(async() => {
        await setupBigQueryTestData(bigQuery, datasetName, tableName)
    })

    it('can get a scalar', async() => {
        const count = await client.getScalar(
            `
                SELECT COUNT(*)
                FROM \`${datasetName}.${tableName}\`;
            `,
            {})

        assert.equal(count, 2)
    })

    it('can get a single row', async() => {
        const row = await client.getSingleRow(
            `
                SELECT first_name AS firstName, last_name AS lastName
                FROM \`${datasetName}.${tableName}\`
                WHERE id = 1;
            `,
            {})

        assert.deepEqual(row, { firstName: 'John', lastName: 'Doe'})
    })

    it('can get multiple rows', async() => {
        const rows = await client.getRows(
            `
                SELECT first_name AS firstName, last_name AS lastName
                FROM \`${datasetName}.${tableName}\`
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
        await tearDownBigQuery(bigQuery, datasetName, tableName)
    })

})