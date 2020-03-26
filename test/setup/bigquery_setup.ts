import {BigQuery, Dataset, Table} from '@google-cloud/bigquery'
import {testEmployees} from '../test_tables'
import * as assert from 'assert'
import {join} from '../../lib/parsing/parsing_helpers'
import * as toSnakeCase from 'js-snakecase'

export function createBigQueryTestClient(): BigQuery {
    return new BigQuery({
        projectId: 'lambda-sql',
        keyFilename: process.env.BIGQUERY_SERVICE_ACCOUNT
    })
}

function checkIfTableExists(table: Table): Promise<boolean> {
    return table
        .exists()
        .then(arr => arr[0])
}

function formatDatePart(input: number) {
    const asString = input.toString()

    const padded = asString.length < 2 ? '0' + asString : asString

    return padded
}

function generateTimestamp(): string {
    const d = new Date()

    const month = formatDatePart(d.getMonth() + 1)
    const day = formatDatePart(d.getDate())
    const year = formatDatePart(d.getFullYear()).slice(2)

    const dateParts = join([year, month, day])

    const hours = d.getHours()
    const minutes = d.getMinutes()
    const seconds = d.getSeconds()

    const timeParts = join([hours, minutes, seconds].map(formatDatePart))

    return `${dateParts}_${timeParts}`
}

export function computeBigQueryTestTableName(): string {
    return `employees_${generateTimestamp()}`
}

export async function setupBigQueryTestData(client: BigQuery, datasetName: string, tableName: string) {
    const dataset = client.dataset(datasetName)
    const table = dataset.table(tableName)

    const tableExistsBeforeCreation = await checkIfTableExists(table)
    assert.equal(tableExistsBeforeCreation, false)

    await dataset
        .createTable(
            tableName,
            {
                schema: [
                    {name: 'id', type: 'INTEGER', mode: 'REQUIRED'},
                    {name: 'first_name', type: 'STRING', mode: 'REQUIRED'},
                    {name: 'last_name', type: 'STRING', mode: 'REQUIRED'},
                    {name: 'title', type: 'STRING', mode: 'REQUIRED'},
                    {name: 'salary', type: 'NUMERIC', mode: 'REQUIRED'},
                    {name: 'department_id', type: 'INTEGER', mode: 'REQUIRED'}
                ]
            })
        .catch(err => {
            console.log(err.errors)
        })

    const tableExistsAfterCreation = await checkIfTableExists(table)
    assert.equal(tableExistsAfterCreation, true)

    const testEmployeesInSnakeCase = testEmployees.map(e =>
        Object.keys(e).reduce(
            (acc, key) => {
                acc[toSnakeCase(key)] = e[key]
                return acc
            },
            {}
        )
    )

    await table
        .insert(testEmployeesInSnakeCase)

}

export async function tearDownBigQuery(client: BigQuery, datasetName: string, tableName: string) {
    const dataset = client.dataset(datasetName)
    const table = dataset.table(tableName)

    await table
        .delete()

    const tableExistsAfterDeletion = await checkIfTableExists(table)
    assert.equal(tableExistsAfterDeletion, false)
}