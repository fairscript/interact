import {departments, employees} from '@fairscript/interact/lib/test/test_tables'

export const employeesThenDepartments = employees
    .join(departments, e => e.departmentId, d => d.id)

export const expectedEmployeesThenDepartmentsLines = [
    'FROM employees t1',
    'INNER JOIN departments t2 ON t1.department_id = t2.id'
]

export const departmentsThenEmployees = departments
    .join(employees, d => d.id, e => e.departmentId)

export const expectedDepartmentsThenEmployeesLines = [
    'FROM departments t1',
    'INNER JOIN employees t2 ON t1.id = t2.department_id'
]