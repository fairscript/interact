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

export const testEmployees =
    [
        {id: 1, firstName: 'John', lastName: 'Doe', title: 'CEO', salary: 10_000, departmentId: 1},
        {id: 2, firstName: 'Richard', lastName: 'Roe', title: 'CFO', salary: 8_000, departmentId: 1},
        {id: 3, firstName: 'Bob', lastName: 'Smith', title: 'Researcher', salary: 6_000, departmentId: 2}
    ]

export const testEmployeeRowsWithoutId = testEmployees.map(e =>
    [e.firstName, e.lastName, e.title, e.salary, e.departmentId]
)