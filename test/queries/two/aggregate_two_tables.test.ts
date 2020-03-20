import * as assert from 'assert'
import {departments, employees} from '../../test_tables'
import {joinWithNewLine} from '../../../lib/parsing/parsing_helpers'

describe('Aggregation of a join of two tables', () => {
    it('with an aggregated column from the first table works', () => {
        assert.equal(
            employees
                .join(departments, e => e.departmentId, d => d.id)
                .groupBy((e, d) => ({departmentId: d.id}))
                .aggregate((k, e, d) => ({departmentId: k.departmentId, average: e.salary.avg()}))
                .toSql(),
            joinWithNewLine([
                `SELECT t2.id AS departmentId, AVG(t1.salary) AS average`,
                'FROM employees t1',
                'INNER JOIN departments t2 ON t1.department_id = t2.id',
                'GROUP BY t2.id'
            ])
        )
    })

    it('with an aggregated column from the second table works', () => {
        assert.equal(
            departments
                .join(employees, d => d.id, e => e.departmentId)
                .groupBy((d, e) => ({departmentId: d.id}))
                .aggregate((k, d, e) => ({departmentId: k.departmentId, average: e.salary.avg()}))
                .toSql(),
            joinWithNewLine([
                `SELECT t1.id AS departmentId, AVG(t2.salary) AS average`,
                'FROM departments t1',
                'INNER JOIN employees t2 ON t1.id = t2.department_id',
                'GROUP BY t1.id'
            ])
        )
    })

    it('with a key combined from columns both two tables', () => {
        assert.equal(
            employees
                .join(departments, e => e.departmentId, d => d.id)
                .groupBy((e, d) => ({departmentId: d.id, employeeTitle: e.title}))
                .aggregate((k, e, d) => ({departmentId: k.departmentId, employeeTitle: k.employeeTitle, average: e.salary.avg()}))
                .toSql(),
            joinWithNewLine([
                `SELECT t2.id AS departmentId, t1.title AS employeeTitle, AVG(t1.salary) AS average`,
                'FROM employees t1',
                'INNER JOIN departments t2 ON t1.department_id = t2.id',
                'GROUP BY t2.id, t1.title'
            ])
        )
    })

    it('with a key combined from columns both two tables (in reverse order)', () => {
        assert.equal(
            departments
                .join(employees, d => d.id, e => e.departmentId)
                .groupBy((d, e) => ({departmentId: d.id, employeeTitle: e.title}))
                .aggregate((k, d, e) => ({departmentId: k.departmentId, employeeTitle: k.employeeTitle, average: e.salary.avg()}))
                .toSql(),
            joinWithNewLine([
                `SELECT t1.id AS departmentId, t2.title AS employeeTitle, AVG(t2.salary) AS average`,
                'FROM departments t1',
                'INNER JOIN employees t2 ON t1.id = t2.department_id',
                'GROUP BY t1.id, t2.title'
            ])
        )
    })
})