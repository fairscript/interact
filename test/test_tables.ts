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