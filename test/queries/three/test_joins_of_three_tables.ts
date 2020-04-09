import {companies, departments, employees} from '../../test_tables'

export const employeesThenDepartmentsThenCompanies = employees
    .join(departments, e => e.departmentId, d => d.id)
    .join(companies, (e, d) => d.companyId, c => c.id)

export const expectedEmployeesThenDepartmentsThenCompaniesLines = [
    'FROM employees t1',
    'INNER JOIN departments t2 ON t1.department_id = t2.id',
    'INNER JOIN companies t3 ON t2.company_id = t3.id'
]

export const departmentsThenEmployeesThenCompanies = departments
    .join(employees, d => d.id, e => e.departmentId)
    .join(companies, (d, e) => d.companyId, c => c.id)

export const expectedDepartmentsThenEmployeesThenCompaniesLines = [
    'FROM departments t1',
    'INNER JOIN employees t2 ON t1.id = t2.department_id',
    'INNER JOIN companies t3 ON t1.company_id = t3.id'
]

export const departmentsThenCompaniesThenEmployees = departments
    .join(companies, d => d.companyId, c => c.id)
    .join(employees, (d, c) => d.id, e => e.departmentId)

export const expectedDepartmentsThenCompaniesThenEmployeesLines = [
    'FROM departments t1',
    'INNER JOIN companies t2 ON t1.company_id = t2.id',
    'INNER JOIN employees t3 ON t1.id = t3.department_id'
]

export const companiesThenDepartmentsThenEmployees = companies
    .join(departments, c => c.id, d => d.companyId)
    .join(employees, (c, d) => d.id, e => e.departmentId)

export const expectedCompaniesThenDepartmentsThenEmployeesLines = [
    'FROM companies t1',
    'INNER JOIN departments t2 ON t1.id = t2.company_id',
    'INNER JOIN employees t3 ON t2.id = t3.department_id'
]