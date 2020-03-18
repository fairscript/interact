import * as assert from 'assert'
import {employees} from '../../test_tables'
import {joinWithNewLine} from '../../../lib/parsing/javascript_parsing'

describe('Aggregation', () => {
    const groupedByDepartmentId = employees
        .groupBy(e => ({departmentId: e.departmentId}))

    function computeExpectedSql(aggregationPart: string) {
        return joinWithNewLine([
            `SELECT t1.department_id AS departmentId, ${aggregationPart}`,
            'FROM employees t1',
            'GROUP BY t1.department_id'
        ])
    }

    it('using averaging works', () => {
        assert.equal(
            groupedByDepartmentId
                .aggregate((k, e) => ({departmentId: k.departmentId, average: e.salary.avg()}))
                .toSql(),
            computeExpectedSql('AVG(t1.salary) AS average')
        )
    })

    it('using counting works', () => {
        assert.equal(
            groupedByDepartmentId
                .aggregate((k, e) => ({departmentId: k.departmentId, count: e.salary.count()}))
                .toSql(),
            computeExpectedSql('COUNT(t1.salary) AS count')
        )
    })

    it('using maximization works', () => {
        assert.equal(
            groupedByDepartmentId
                .aggregate((k, e) => ({departmentId: k.departmentId, maximum: e.salary.max()}))
                .toSql(),
            computeExpectedSql('MAX(t1.salary) AS maximum')
        )
    })

    it('using minimization works', () => {
        assert.equal(
            groupedByDepartmentId
                .aggregate((k, e) => ({departmentId: k.departmentId, minimum: e.salary.min()}))
                .toSql(),
            computeExpectedSql('MIN(t1.salary) AS minimum')
        )
    })

    it('using summation works', () => {
        assert.equal(
            groupedByDepartmentId
                .aggregate((k, e) => ({departmentId: k.departmentId, sum: e.salary.sum()}))
                .toSql(),
            computeExpectedSql('SUM(t1.salary) AS sum')
        )
    })

    it('using averaging counting, minimization, maximization and summation works', () => {
        assert.equal(
            groupedByDepartmentId
                .aggregate((key, e) => ({
                    departmentId: key.departmentId,
                    average: e.salary.avg(),
                    count: e.salary.count(),
                    maximum: e.salary.max(),
                    minimum: e.salary.min(),
                    sum: e.salary.sum()
                }))
                .toSql(),
            computeExpectedSql('AVG(t1.salary) AS average, COUNT(t1.salary) AS count, MAX(t1.salary) AS maximum, MIN(t1.salary) AS minimum, SUM(t1.salary) AS sum')
        )
    })
})