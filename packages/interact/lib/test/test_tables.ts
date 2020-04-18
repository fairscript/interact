import {defineTable} from '..'
import {Employee} from './model/employee'
import {Company} from './model/companies'
import {Department} from './model/department'

export const employees = defineTable<Employee>(
    'employees',
    {
        id: 'integer',
        firstName: 'string',
        lastName: 'string',
        title: 'string',
        salary: 'integer',
        departmentId: 'integer',
        fulltime: 'boolean'
    })

export const testEmployees: Employee[] =
    [
        new Employee(1, 'John', 'Doe', 'CEO', 10_000, 1, true),
        new Employee(2, 'Richard', 'Roe', 'CFO', 10_000, 1, true),
        new Employee(3, 'Jane', 'Poe', 'Researcher', 6_000, 2, true),
        new Employee(4, 'Bob', 'Smith', 'Researcher', 6_000, 2, true),
        new Employee(5, 'James', 'Miller', 'Assistant', 2_000, 2, false)
    ]

export const departments = defineTable<Department>(
    'departments',
    {
        id: 'integer',
        name: 'string',
        companyId: 'integer'
    })

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