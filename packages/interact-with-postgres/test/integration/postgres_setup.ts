import {PostgresClient} from '../../lib/postgres_client'
import {Client} from 'pg'
import {testEmployeeRowsWithoutId} from '@fairscript/interact'

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
        'INSERT INTO employees (first_name, last_name, title, salary, department_id, fulltime) VALUES ($1, $2, $3, $4, $5, $6), ($7, $8, $9, $10, $11, $12), ($13, $14, $15, $16, $17, $18), ($19, $20, $21, $22, $23, $24), ($25, $26, $27, $28, $29, $30);',
        testEmployeeRowsWithoutId)
}