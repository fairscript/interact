import {BigQuery, Dataset, Table} from '@google-cloud/bigquery'
import * as assert from 'assert'
import * as toSnakeCase from 'js-snakecase'
import {join, joinWithUnderscore} from '@fairscript/interact/lib/join'
import {testDepartments, testEmployees} from '@fairscript/interact/lib/test/test_tables'
import {TableMetadata} from '@google-cloud/bigquery/build/src/table'


export function createBigQueryForTests(): BigQuery {
    const projectId = 'lambda-sql'
    const keyFilename = process.env.BIGQUERY_SERVICE_ACCOUNT

    return new BigQuery({
        projectId,
        keyFilename
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

export function computeBigQueryTestTableName(prefix: string, name: string): string {
    return joinWithUnderscore([
        prefix,
        name,
        generateTimestamp()
    ])
}

async function setUpBigQueryTable<T>(dataset: Dataset, tableName: string, metaData: TableMetadata, data: T[]) {
    const table = dataset.table(tableName)

    const tableExistsBeforeCreation = await checkIfTableExists(table)
    assert.equal(tableExistsBeforeCreation, false)

    await dataset
        .createTable(
            tableName,
            metaData)
        .catch(err => {
            console.log(err.errors)
        })

    const tableExistsAfterCreation = await checkIfTableExists(table)
    assert.equal(tableExistsAfterCreation, true)

    const dataInSnakeCase = data.map(e =>
        Object.keys(e).reduce(
            (acc, key) => {
                acc[toSnakeCase(key)] = e[key]
                return acc
            },
            {}
        )
    )

    await table
        .insert(dataInSnakeCase)
}

export async function setUpBigQueryTestData(dataset: Dataset, employeesTableName: string, departmentsTableName: string|null = null) {
    const employeesSchema = {
        schema: [
            {name: 'id', type: 'INTEGER', mode: 'REQUIRED'},
            {name: 'first_name', type: 'STRING', mode: 'REQUIRED'},
            {name: 'last_name', type: 'STRING', mode: 'REQUIRED'},
            {name: 'title', type: 'STRING', mode: 'REQUIRED'},
            {name: 'salary', type: 'INTEGER', mode: 'REQUIRED'},
            {name: 'department_id', type: 'INTEGER', mode: 'REQUIRED'},
            {name: 'fulltime', type: 'BOOL', mode: 'REQUIRED'}
        ]
    }

    await setUpBigQueryTable(dataset, employeesTableName, employeesSchema, testEmployees)

    if (departmentsTableName !== null) {
        const departmentsSchema = {
            schema: [
                {name: 'id', type: 'INTEGER', mode: 'REQUIRED'},
                {name: 'name', type: 'STRING', mode: 'REQUIRED'},
                {name: 'company_id', type: 'INTEGER', mode: 'REQUIRED'}
            ]
        }

        await setUpBigQueryTable(dataset, departmentsTableName, departmentsSchema, testDepartments)
    }
}

async function tearDownBigQueryTable(dataset: Dataset, tableName: string) {
    const table = dataset.table(tableName)

    await table.delete()

    const tableExistsAfterDeletion = await checkIfTableExists(table)
    assert.equal(tableExistsAfterDeletion, false)
}


export async function tearDownBigQueryTestData(dataset: Dataset, employeesTableName: string, departmentsTableName: string|null = null) {
    await tearDownBigQueryTable(dataset,  employeesTableName)

    if (departmentsTableName !== null) {
        await tearDownBigQueryTable(dataset, departmentsTableName)
    }
}