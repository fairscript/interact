import {PostgresClient} from '../../lib/postgres_client'
import {Client} from 'pg'
import {testDepartments, testEmployees} from '@fairscript/interact/lib/test/test_tables'

export function createPgTestClient(): Client {
    const config = {
        connectionString: process.env.POSTGRES_URL,
        ssl: {
            rejectUnauthorized: false
        }
    }
    return new Client(config)
}

export async function setUpPostgresTestData(client: PostgresClient) {
    await client.run('TRUNCATE TABLE employees RESTART IDENTITY;')

    await client.runBatch(
        'INSERT INTO employees (first_name, last_name, title, salary, department_id, fulltime) VALUES ($1, $2, $3, $4, $5, $6), ($7, $8, $9, $10, $11, $12), ($13, $14, $15, $16, $17, $18), ($19, $20, $21, $22, $23, $24), ($25, $26, $27, $28, $29, $30);',
        testEmployees.map(e =>
            [e.firstName, e.lastName, e.title, e.salary, e.departmentId, e.fulltime]
        )
    )

    await client.run('TRUNCATE TABLE departments RESTART IDENTITY;')

    await client.runBatch(
        'INSERT INTO departments (name, company_id) VALUES ($1, $2), ($3, $4);',
        testDepartments.map(d =>
            [d.name, d.companyId]
        )
    )
}