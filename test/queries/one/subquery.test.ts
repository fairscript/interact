import {employees} from '../../test_tables'
import {checkSql} from '../sql_assertion'

describe('map with a subtable works', () => {
    describe('with an unfiltered subquery', () => {

        it('using a count operation', () => {
            const query = employees
                .map(
                    employees,
                    (st, e) => ({
                        id: e.id,
                        count: st.count()
                    }))

            const expectedLines = [
                'SELECT t1.id AS id, (SELECT COUNT(*) FROM employees s1) AS count',
                'FROM employees t1'
            ]

            checkSql(query, expectedLines)
        })

        it('using a maximum operation', () => {
            const query = employees
                .map(
                    employees,
                    (st, e) => ({
                        id: e.id,
                        highestSalary: st.max(e => e.salary)
                    }))

            const expectedLines = [
                'SELECT t1.id AS id, (SELECT MAX(s1.salary) FROM employees s1) AS highestSalary',
                'FROM employees t1'
            ]

            checkSql(query, expectedLines)
        })

        it('using counting and maximimization', () => {
            const query = employees
                .map(
                    employees,
                    (st, e) => ({
                        id: e.id,
                        count: st.count(),
                        highestSalary: st.max(e => e.salary)
                    }))

            const expectedLines = [
                'SELECT t1.id AS id, (SELECT COUNT(*) FROM employees s1) AS count, (SELECT MAX(s1.salary) FROM employees s1) AS highestSalary',
                'FROM employees t1'
            ]

            checkSql(query, expectedLines)
        })
    })

    describe('with a filtered subquery', () => {
        it('on a table', () => {
            const query = employees
                .map(
                    employees,
                    (st, e) => ({
                        id: e.id,
                        higherSalary: st.filter(se => se.salary > e.salary).count()
                    }))

            const expectedLines = [
                'SELECT t1.id AS id, (SELECT COUNT(*) FROM employees s1 WHERE s1.salary > t1.salary) AS higherSalary',
                'FROM employees t1'
            ]

            checkSql(query, expectedLines)
        })

        it('on a filtered table', () => {
            const query = employees
                .filter(e => e.salary >= 5000)
                .map(
                    employees,
                    (st, e) => ({
                        id: e.id,
                        higherSalary: st.filter(se => se.salary > e.salary).count()
                    }))

            const expectedLines = [
                'SELECT t1.id AS id, (SELECT COUNT(*) FROM employees s1 WHERE s1.salary > t1.salary) AS higherSalary',
                'FROM employees t1',
                'WHERE t1.salary >= 5000'
            ]

            checkSql(query, expectedLines)
        })

        it('on a sorted table', () => {
            const query = employees
                .sortDescendinglyBy(e => e.salary)
                .map(
                    employees,
                    (st, e) => ({
                        id: e.id,
                        higherSalary: st.filter(se => se.salary > e.salary).count()
                    }))

            const expectedLines = [
                'SELECT t1.id AS id, (SELECT COUNT(*) FROM employees s1 WHERE s1.salary > t1.salary) AS higherSalary',
                'FROM employees t1',
                'ORDER BY t1.salary DESC'
            ]

            checkSql(query, expectedLines)
        })
    })

    it('with a subquery that has two filters', () => {
        const query = employees
            .map(
                employees,
                (st, e) => ({
                    id: e.id,
                    higherSalary: st.filter(se => se.departmentId === e.departmentId).filter(se => se.salary > e.salary).count()
                }))

        const expectedLines = [
            'SELECT t1.id AS id, (SELECT COUNT(*) FROM employees s1 WHERE (s1.department_id = t1.department_id) AND (s1.salary > t1.salary)) AS higherSalary',
            'FROM employees t1'
        ]

        checkSql(query, expectedLines)
    })
})
