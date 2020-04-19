import {defineTable} from '..'
import {Employee} from './model/employee'
import {Company} from './model/companies'
import {Department} from './model/department'
import {Table} from '../queries/one/table'

export function defineEmployeesTable(name: string): Table<Employee> {
    return defineTable<Employee>(
        name,
        {
            id: 'integer',
            firstName: 'string',
            lastName: 'string',
            title: 'string',
            salary: 'integer',
            departmentId: 'integer',
            fulltime: 'boolean'
        })
}

export const employees = defineEmployeesTable('employees')

export const testEmployees: Employee[] =
    [
        new Employee(1, 'John', 'Doe', 'CEO', 10_000, 1, true),
        new Employee(2, 'Richard', 'Roe', 'CFO', 10_000, 1, true),
        new Employee(3, 'Jane', 'Poe', 'Researcher', 6_000, 2, true),
        new Employee(4, 'Bob', 'Smith', 'Researcher', 6_000, 2, true),
        new Employee(5, 'James', 'Miller', 'Assistant', 2_000, 2, false)
    ]

export function defineDepartmentsTable(name: string): Table<Department> {
    return defineTable<Department>(
        name,
        {
            id: 'integer',
            name: 'string',
            companyId: 'integer'
        })
}

export const departments = defineDepartmentsTable('departments')

export const testDepartments: Department[] =
    [
        new Department(1, 'Board of Directors', 1),
        new Department(2, 'Research & Development', 1)
    ]

export const companies = defineTable<Company>(
    'companies',
    {
        id: 'integer',
        name: 'string',
    })

export const testCompanies: Company[] =
    [
        new Company(1, 'Board of Directors'),
    ]