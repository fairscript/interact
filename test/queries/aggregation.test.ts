import * as assert from 'assert'
import {employees} from '../test_tables'
import {joinWithNewLine} from '../../lib/parsing/parsing'

describe('Aggregation', () => {
    const groupedByDepartmentId = employees
        .groupBy(e => ({departmentId: e.departmentId}))

    function computeExpectedSql(aggregationOperation: string, alias: string) {
        return joinWithNewLine([
            `SELECT t1.department_id AS departmentId, ${aggregationOperation}(t1.salary) AS ${alias}`,
            'FROM employees t1',
            'GROUP BY t1.department_id'
        ])
    }

    it('using averaging works', () => {
        assert.equal(
            groupedByDepartmentId
                .aggregate((k, x) => ({departmentId: k.departmentId, average: x.salary.avg()}))
                .toString(),
            computeExpectedSql('AVG', 'average')
        )
    })

    it('using counting works', () => {
        assert.equal(
            groupedByDepartmentId
                .aggregate((k, x) => ({departmentId: k.departmentId, count: x.salary.count()}))
                .toString(),
            computeExpectedSql('COUNT', 'count')
        )
    })

    it('using maximization works', () => {
        assert.equal(
            groupedByDepartmentId
                .aggregate((k, x) => ({departmentId: k.departmentId, maximum: x.salary.max()}))
                .toString(),
            computeExpectedSql('MAX', 'maximum')
        )
    })

    it('using minimization works', () => {
        assert.equal(
            groupedByDepartmentId
                .aggregate((k, x) => ({departmentId: k.departmentId, minimum: x.salary.min()}))
                .toString(),
            computeExpectedSql('MIN', 'minimum')
        )
    })

    it('using summation works', () => {
        assert.equal(
            groupedByDepartmentId
                .aggregate((k, x) => ({departmentId: k.departmentId, sum: x.salary.sum()}))
                .toString(),
            computeExpectedSql('SUM', 'sum')
        )
    })
})