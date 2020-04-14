import {checkSql} from '../sql_assertion'
import {employees} from '@fairscript/interact/lib/test/test_tables'

describe('Aggregation', () => {
    const groupedByDepartmentId = employees
        .groupBy(e => ({departmentId: e.departmentId}))

    function computeExpectedLines(aggregationPart: string): string[] {
        return [
            `SELECT t1.department_id AS departmentId, ${aggregationPart}`,
            'FROM employees t1',
            'GROUP BY t1.department_id'
        ]
    }

    it('using averaging works', () => {
        checkSql(
            groupedByDepartmentId
                .aggregate((k, e) => ({departmentId: k.departmentId, average: e.salary.avg()})),
            computeExpectedLines('AVG(t1.salary) AS average')
        )
    })

    it('using maximization works', () => {
        checkSql(
            groupedByDepartmentId
                .aggregate((k, e) => ({departmentId: k.departmentId, maximum: e.salary.max()})),
            computeExpectedLines('MAX(t1.salary) AS maximum')
        )
    })

    it('using minimization works', () => {
        checkSql(
            groupedByDepartmentId
                .aggregate((k, e) => ({departmentId: k.departmentId, minimum: e.salary.min()})),
            computeExpectedLines('MIN(t1.salary) AS minimum')
        )
    })

    it('using summation works', () => {
        checkSql(
            groupedByDepartmentId
                .aggregate((k, e) => ({departmentId: k.departmentId, sum: e.salary.sum()})),
            computeExpectedLines('SUM(t1.salary) AS sum')
        )
    })

    it('using counting works', () => {
        checkSql(
            groupedByDepartmentId
                .aggregate((k, e, count) => ({departmentId: k.departmentId, count: count()})),
            computeExpectedLines('COUNT(*) AS count')
        )
    })

    it('using averaging counting, minimization, maximization and summation works', () => {
        checkSql(
            groupedByDepartmentId
                .aggregate((key, e, count) => ({
                    departmentId: key.departmentId,
                    average: e.salary.avg(),
                    maximum: e.salary.max(),
                    minimum: e.salary.min(),
                    sum: e.salary.sum(),
                    count: count()
                })),
            computeExpectedLines('AVG(t1.salary) AS average, MAX(t1.salary) AS maximum, MIN(t1.salary) AS minimum, SUM(t1.salary) AS sum, COUNT(*) AS count')
        )
    })
})