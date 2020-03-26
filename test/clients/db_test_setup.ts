import {Client} from 'pg'
import {testEmployeeRows} from '../test_tables'
import {SqliteClient} from '../../lib/clients/sqlite_client'
import {PostgresClient} from '../../lib/clients/postgres_client'

export async function setupSqliteTestData(client: SqliteClient) {
    await client.run(`
        CREATE TABLE employees
        (
            id INTEGER NOT NULL CONSTRAINT employees_pk PRIMARY KEY AUTOINCREMENT,
            first_name TEXT NOT NULL,
            last_name TEXT NOT NULL,
            title TEXT NOT NULL,
            salary REAL NOT NULL,
            department_id INTEGER NOT NULL
        );        
    `)

    await client.runBatch(
        `
            INSERT INTO employees (first_name, last_name, title, salary, department_id)
            VALUES (?, ?, ?, ?, ?);
        `,
        testEmployeeRows)
}

export function createPgTestClient() {
    return new Client({
        connectionString: process.env.POSTGRES_URL,
        ssl: {
            rejectUnauthorized: false
        }
    })
}

export async function setupPostgresTestData(client: PostgresClient) {
    await client.run('TRUNCATE TABLE employees RESTART IDENTITY;')

    await client.runBatch(
        'INSERT INTO employees (first_name, last_name, title, salary, department_id) VALUES ($1, $2, $3, $4, $5), ($6, $7, $8, $9, $10);',
        testEmployeeRows)
}