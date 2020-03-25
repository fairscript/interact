export const sqliteSetup = {

    createEmployeesTable: `
        CREATE TABLE employees
        (
            id INTEGER NOT NULL CONSTRAINT employees_pk PRIMARY KEY AUTOINCREMENT,
            first_name TEXT NOT NULL,
            last_name TEXT NOT NULL,
            title TEXT NOT NULL,
            salary REAL NOT NULL,
            department_id INTEGER NOT NULL
        );        
    `,

    insertIntoEmployees: `
        INSERT INTO employees (first_name, last_name, title, salary, department_id)
        VALUES (?, ?, ?, ?, ?)
    `
}

export const postgresSetup = {
    truncateEmployeesTable: 'TRUNCATE TABLE employees RESTART IDENTITY',
    insertTwoEmployees: 'INSERT INTO employees (first_name, last_name, title, salary, department_id) VALUES ($1, $2, $3, $4, $5), ($6, $7, $8, $9, $10)'
}