import {ColumnRecord} from '../../record'
import {Columns} from '../../queries/one/table'

export class Employee {
    constructor(
        public id: number,
        public firstName: string,
        public lastName: string,
        public title: string,
        public salary: number,
        public departmentId: number,
        public fulltime: boolean) {
    }
}

export const employeeColumns: Columns<Employee> = {
    id: 'number',
    firstName: 'string',
    lastName: 'string',
    title: 'string',
    salary: 'string',
    departmentId: 'number',
    fulltime: 'boolean'
}