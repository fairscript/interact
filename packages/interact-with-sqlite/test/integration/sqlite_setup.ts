import {SqliteClient} from '../../lib/sqlite_client'
import {testDepartments, testEmployees} from '@fairscript/interact/lib/test/test_tables'

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
        testEmployees.map(e =>
            [e.firstName, e.lastName, e.title, e.salary, e.departmentId, e.fulltime]
        )
    )

    await client.run(`
        CREATE TABLE departments
        (
            id INTEGER NOT NULL CONSTRAINT employees_pk PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            company_id INTEGER NOT NULL
        );
    `)

    await client.runBatch(
        `
            INSERT INTO departments (name, company_id)
            VALUES (?, ?);
        `,
        testDepartments.map(d =>
            [d.name, d.companyId]
        )
    )
}