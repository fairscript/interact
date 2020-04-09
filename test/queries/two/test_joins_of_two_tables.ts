import {departments, employees} from '../../test_tables'

export const employeesThenDepartments = employees
    .join(departments, e => e.departmentId, d => d.id)

export const departmentsThenEmployees = departments
    .join(employees, d => d.id, e => e.departmentId)