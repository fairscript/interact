import {createTable} from '../lib'

export class Employee {
    constructor(
        public id: number,
        public firstName: string,
        public lastName: string,
        public title: string,
        public departmentId: string) {
    }
}

export const employees = createTable(Employee, 'employees')