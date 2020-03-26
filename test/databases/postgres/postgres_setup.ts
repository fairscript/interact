import {PostgresClient} from '../../../lib/databases/postgres/postgres_client'
import {testEmployeeRowsWithoutId} from '../../test_tables'
import {Client} from 'pg'

export function createPgTestClient(): Client {
    return new Client({
        connectionString: process.env.POSTGRES_URL,
        ssl: {
            rejectUnauthorized: false
        }
    })
}

export async function setUpPostgresTestData(client: PostgresClient) {
    await client.run('TRUNCATE TABLE employees RESTART IDENTITY;')

    await client.runBatch(
        'INSERT INTO employees (first_name, last_name, title, salary, department_id) VALUES ($1, $2, $3, $4, $5), ($6, $7, $8, $9, $10);',
        testEmployeeRowsWithoutId)
}