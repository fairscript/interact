import {employees} from '@fairscript/interact'
import {checkSql} from '../sql_assertion'

describe('Ordering a grouping', () => {
    const groupedByDepartmentId = employees
        .groupBy(e => ({departmentId: e.departmentId}))

    it('by the key works', () => {
        checkSql(
            groupedByDepartmentId
                .sortBy(k => k.departmentId)
                .aggregate((k, e) => ({department: k.departmentId})),
            [
                'SELECT t1.department_id AS department',
                'FROM employees t1',
                'GROUP BY t1.department_id',
                'ORDER BY t1.department_id ASC'
            ]
        )
    })

    it('by a maximum works', () => {
        checkSql(
            groupedByDepartmentId
                .sortDescendinglyBy((k, e) => e.salary.max())
                .aggregate((k, e) => ({department: k.departmentId, highestSalary: e.salary.max()})),
            [
                'SELECT t1.department_id AS department, MAX(t1.salary) AS highestSalary',
                'FROM employees t1',
                'GROUP BY t1.department_id',
                'ORDER BY MAX(t1.salary) DESC'
            ]
        )
    })

    it('by a count works', () => {
        checkSql(
            groupedByDepartmentId
                .sortDescendinglyBy((k, e, count) => count())
                .aggregate((k, e, count) => ({department: k.departmentId, employees: count()})),
            [
                'SELECT t1.department_id AS department, COUNT(*) AS employees',
                'FROM employees t1',
                'GROUP BY t1.department_id',
                'ORDER BY COUNT(*) DESC'
            ]
        )
    })


})