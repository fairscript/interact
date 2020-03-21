import {defineTable} from '../lib'

export class Employee {
    constructor(
        public id: number,
        public firstName: string,
        public lastName: string,
        public title: string,
        public salary: number,
        public departmentId: number) {
    }
}

export class Department {
    constructor(
        public id: number,
        public name: string) {
    }
}

export const employees = defineTable(Employee, 'employees')
export const departments = defineTable(Department, 'departments')

export const createEmployeesTableSql = `
    CREATE TABLE employees
    (
        id INTEGER NOT NULL CONSTRAINT employees_pk PRIMARY KEY AUTOINCREMENT,
        first_name TEXT NOT NULL,
        last_name TEXT NOT NULL,
        title TEXT NOT NULL,
        salary REAL NOT NULL,
        department_id INTEGER NOT NULL
    );        
`

export const insertEmployeeSql = `
    INSERT INTO employees (first_name, last_name, title, salary, department_id)
    VALUES (?, ?, ?, ?, ?)
`