import {companies, departments, employees} from '../../test_tables'

export const employeesThenDepartmentsThenCompanies = employees
    .join(departments, e => e.departmentId, d => d.id)
    .join(companies, (e, d) => d.companyId, c => c.id)

export const departmentsThenEmployeesThenCompanies = departments
    .join(employees, d => d.id, e => e.departmentId)
    .join(companies, (d, e) => d.companyId, c => c.id)

export const departmentsThenCompaniesThenEmployees = departments
    .join(companies, d => d.companyId, c => c.id)
    .join(employees, (d, c) => d.id, e => e.departmentId)