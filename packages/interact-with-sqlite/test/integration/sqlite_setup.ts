import {testEmployeeRowsWithoutId} from '@fairscript/interact'
import {SqliteClient} from '../../lib/sqlite_client'

export async function setUpSqliteTestData(client: SqliteClient) {
    await client.run(`
        CREATE TABLE employees
        (
            id INTEGER NOT NULL CONSTRAINT employees_pk PRIMARY KEY AUTOINCREMENT,
            first_name TEXT NOT NULL,
            last_name TEXT NOT NULL,
            title TEXT NOT NULL,
            salary REAL NOT NULL,
            department_id INTEGER NOT NULL,
            fulltime INTEGER NOT NULL
        );        
    `)

    await client.runBatch(
        `
            INSERT INTO employees (first_name, last_name, title, salary, department_id, fulltime)
            VALUES (?, ?, ?, ?, ?, ?);
        `,
        testEmployeeRowsWithoutId)
}