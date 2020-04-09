import {checkSql} from '../sql_assertion'
import {
    departmentsThenCompaniesThenEmployees,
    departmentsThenEmployeesThenCompanies,
    employeesThenDepartmentsThenCompanies
} from './test_joins_of_three_tables'

describe('JoinThirdTable can sort', () => {
    describe('in ascending order by a column', () => {
        it('in the first table', () => {
            checkSql(
                employeesThenDepartmentsThenCompanies
                    .sortBy((e, d, c) => e.salary)
                    .get((e, d, c) => e.id),
                [
                    'SELECT t1.id',
                    'FROM employees t1',
                    'INNER JOIN departments t2 ON t1.department_id = t2.id',
                    'INNER JOIN companies t3 ON t2.company_id = t3.id',
                    'ORDER BY t1.salary ASC'
                ]
            )
        })

        it('in the second table', () => {
            checkSql(
                departmentsThenEmployeesThenCompanies
                    .sortBy((d, e, c) => e.salary)
                    .get((d, e, c) => e.id),
                [
                    'SELECT t2.id',
                    'FROM departments t1',
                    'INNER JOIN employees t2 ON t1.id = t2.department_id',
                    'INNER JOIN companies t3 ON t1.company_id = t3.id',
                    'ORDER BY t2.salary ASC'
                ]
            )
        })

        it('in the third table', () => {
            checkSql(
                departmentsThenCompaniesThenEmployees
                    .sortBy((d, c, e) => e.salary)
                    .get((d, c, e) => e.id),
                [
                    'SELECT t3.id',
                    'FROM departments t1',
                    'INNER JOIN companies t2 ON t1.company_id = t2.id',
                    'INNER JOIN employees t3 ON t1.id = t3.department_id',
                    'ORDER BY t3.salary ASC'
                ]
            )
        })
    })

})