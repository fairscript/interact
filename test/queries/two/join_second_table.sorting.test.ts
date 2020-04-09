import {checkSql} from '../sql_assertion'
import {departmentsThenEmployees, employeesThenDepartments} from './test_joins_of_two_tables'

describe('JoinSecondTable can sort', () => {
    describe('in ascending order by a column', () => {
        it('in the first table', () => {
            checkSql(
                employeesThenDepartments
                    .sortBy(e => e.salary)
                    .get(e => e.id),
                [
                    'SELECT t1.id',
                    'FROM employees t1',
                    'INNER JOIN departments t2 ON t1.department_id = t2.id',
                    'ORDER BY t1.salary ASC'
                ]
            )
        })

        it('in the second table', () => {
            checkSql(
                departmentsThenEmployees
                    .sortBy((d, e) => e.salary)
                    .get((d, e) => e.id),
                [
                    'SELECT t2.id',
                    'FROM departments t1',
                    'INNER JOIN employees t2 ON t1.id = t2.department_id',
                    'ORDER BY t2.salary ASC'
                ]
            )
        })
    })

    describe('in descending order', () => {
        it('in the first table', () => {
            checkSql(
                employeesThenDepartments
                    .sortDescendinglyBy(e => e.salary)
                    .get(e => e.id),
                [
                    'SELECT t1.id',
                    'FROM employees t1',
                    'INNER JOIN departments t2 ON t1.department_id = t2.id',
                    'ORDER BY t1.salary DESC'
                ]
            )
        })

        it('in the second table', () => {
            checkSql(
                departmentsThenEmployees
                    .sortDescendinglyBy((d, e) => e.salary)
                    .get((d, e) => e.id),
                [
                    'SELECT t2.id',
                    'FROM departments t1',
                    'INNER JOIN employees t2 ON t1.id = t2.department_id',
                    'ORDER BY t2.salary DESC'
                ]
            )
        })
    })

})