import * as assert from 'assert'
import {employees} from '../../test_tables'
import {joinWithNewLine} from '../../../lib/parsing/parsing_helpers'

describe('mapS works', () => {
    it('for a map with an unfiltered subquery', () => {
        const actual = employees
            .mapS(
                employees,
                (st, e) => ({
                    id: e.id,
                    count: st.count()
                }))
            .toSql()

        const expected = joinWithNewLine([
            'SELECT t1.id AS id, (SELECT COUNT(*) FROM employees s1) AS count',
            'FROM employees t1'
        ])

        assert.deepEqual(actual, expected)
    })

    describe('for a map with a filtered subquery', () => {

        it('on a table', () => {
            const actual = employees
                .mapS(
                    employees,
                    (st, e) => ({
                        id: e.id,
                        higherSalary: st.filter(se => se.salary > e.salary).count()
                    }))
                .toSql()

            const expected = joinWithNewLine([
                'SELECT t1.id AS id, (SELECT COUNT(*) FROM employees s1 WHERE s1.salary > t1.salary) AS higherSalary',
                'FROM employees t1'
            ])

            assert.deepEqual(actual, expected)
        })

        it('on a filtered table', () => {
            const actual = employees
                .filter(e => e.salary >= 5000)
                .mapS(
                    employees,
                    (st, e) => ({
                        id: e.id,
                        higherSalary: st.filter(se => se.salary > e.salary).count()
                    }))
                .toSql()

            const expected = joinWithNewLine([
                'SELECT t1.id AS id, (SELECT COUNT(*) FROM employees s1 WHERE s1.salary > t1.salary) AS higherSalary',
                'FROM employees t1',
                'WHERE t1.salary >= 5000'
            ])

            assert.deepEqual(actual, expected)
        })

        it('on a sorted table', () => {
            const actual = employees
                .sortDescendinglyBy(e => e.salary)
                .mapS(
                    employees,
                    (st, e) => ({
                        id: e.id,
                        higherSalary: st.filter(se => se.salary > e.salary).count()
                    }))
                .toSql()

            const expected = joinWithNewLine([
                'SELECT t1.id AS id, (SELECT COUNT(*) FROM employees s1 WHERE s1.salary > t1.salary) AS higherSalary',
                'FROM employees t1',
                'ORDER BY t1.salary DESC'
            ])

            assert.deepEqual(actual, expected)
        })
    })

    it('for a map with a subquery that has two filters', () => {
        const actual = employees
            .mapS(
                employees,
                (st, e) => ({
                    id: e.id,
                    higherSalary: st.filter(se => se.departmentId === e.departmentId).filter(se => se.salary > e.salary).count()
                }))
            .toSql()

        const expected = joinWithNewLine([
            'SELECT t1.id AS id, (SELECT COUNT(*) FROM employees s1 WHERE (s1.department_id = t1.department_id) AND (s1.salary > t1.salary)) AS higherSalary',
            'FROM employees t1'
        ])

        assert.deepEqual(actual, expected)
    })
})
