import {employees} from '../../test_tables'
import {checkSql} from '../sql_assertion'

describe('mapS works', () => {
    it('for a map with an unfiltered subquery', () => {
        const query = employees
            .mapS(
                employees,
                (st, e) => ({
                    id: e.id,
                    count: st.count()
                }))

        const expectedLines = [
            'SELECT t1.id AS "id", (SELECT COUNT(*) FROM employees s1) AS "count"',
            'FROM employees t1'
        ]

        checkSql(query, expectedLines)
    })

    describe('for a map with a filtered subquery', () => {

        it('on a table', () => {
            const query = employees
                .mapS(
                    employees,
                    (st, e) => ({
                        id: e.id,
                        higherSalary: st.filter(se => se.salary > e.salary).count()
                    }))

            const expectedLines = [
                'SELECT t1.id AS "id", (SELECT COUNT(*) FROM employees s1 WHERE s1.salary > t1.salary) AS "higherSalary"',
                'FROM employees t1'
            ]

            checkSql(query, expectedLines)
        })

        it('on a filtered table', () => {
            const query = employees
                .filter(e => e.salary >= 5000)
                .mapS(
                    employees,
                    (st, e) => ({
                        id: e.id,
                        higherSalary: st.filter(se => se.salary > e.salary).count()
                    }))

            const expectedLines = [
                'SELECT t1.id AS "id", (SELECT COUNT(*) FROM employees s1 WHERE s1.salary > t1.salary) AS "higherSalary"',
                'FROM employees t1',
                'WHERE t1.salary >= 5000'
            ]

            checkSql(query, expectedLines)
        })

        it('on a sorted table', () => {
            const query = employees
                .sortDescendinglyBy(e => e.salary)
                .mapS(
                    employees,
                    (st, e) => ({
                        id: e.id,
                        higherSalary: st.filter(se => se.salary > e.salary).count()
                    }))

            const expectedLines = [
                'SELECT t1.id AS "id", (SELECT COUNT(*) FROM employees s1 WHERE s1.salary > t1.salary) AS "higherSalary"',
                'FROM employees t1',
                'ORDER BY t1.salary DESC'
            ]

            checkSql(query, expectedLines)
        })
    })

    it('for a map with a subquery that has two filters', () => {
        const query = employees
            .mapS(
                employees,
                (st, e) => ({
                    id: e.id,
                    higherSalary: st.filter(se => se.departmentId === e.departmentId).filter(se => se.salary > e.salary).count()
                }))

        const expectedLines = [
            'SELECT t1.id AS "id", (SELECT COUNT(*) FROM employees s1 WHERE (s1.department_id = t1.department_id) AND (s1.salary > t1.salary)) AS "higherSalary"',
            'FROM employees t1'
        ]

        checkSql(query, expectedLines)
    })
})
