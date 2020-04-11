import {defineTable} from '..'
import {Employee} from './model/employee'
import {Company} from './model/companies'
import {Department} from './model/department'

export const employees = defineTable(Employee, 'employees')
export const departments = defineTable(Department, 'departments')
export const companies = defineTable(Company, 'companies')

export const testEmployees: Employee[] =
    [
        new Employee(1, 'John', 'Doe', 'CEO', 10_000, 1, true),
        new Employee(2, 'Richard', 'Roe', 'CFO', 10_000, 1, true),
        new Employee(3, 'Jane', 'Poe', 'Researcher', 6_000, 2, true),
        new Employee(4, 'Bob', 'Smith', 'Researcher', 6_000, 2, true),
        new Employee(5, 'James', 'Miller', 'Assistant', 2_000, 2, false)
    ]

export const testEmployeeRowsWithoutId = testEmployees.map(e =>
    [e.firstName, e.lastName, e.title, e.salary, e.departmentId, e.fulltime]
)