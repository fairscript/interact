import * as assert from 'assert'
import {departments, employees} from '../test_tables'
import {joinWithNewLine} from '../../lib/parsing/javascript_parsing'

describe('Sorting two tables', () => {
    const join = employees
        .join(departments, e => e.departmentId, d => d.id)

    describe('works using a order', () => {
        it('in ascending direction', () => {
            assert.equal(
                join
                    .sortBy(e => e.salary)
                    .map(e => e.id)
                    .toSql(),
                joinWithNewLine([
                    'SELECT t1.id',
                    'FROM employees t1',
                    'INNER JOIN departments t2 ON t1.department_id = t2.id',
                    'ORDER BY t1.salary ASC'
                ])
            )
        })

        it('in descending direction', () => {
            assert.equal(
                join
                    .sortDescendinglyBy(e => e.salary)
                    .map(e => e.id)
                    .toSql(),
                joinWithNewLine([
                    'SELECT t1.id',
                    'FROM employees t1',
                    'INNER JOIN departments t2 ON t1.department_id = t2.id',
                    'ORDER BY t1.salary DESC'
                ])
            )
        })
    })

    it('works using multiple orders', () => {
        assert.equal(
            join
                .sortBy((e, d) => d.name)
                .thenBy(e => e.firstName)
                .thenBy(e => e.lastName)
                .map(e => e.id)
                .toSql(),
            joinWithNewLine([
                'SELECT t1.id',
                'FROM employees t1',
                'INNER JOIN departments t2 ON t1.department_id = t2.id',
                'ORDER BY t2.name ASC, t1.first_name ASC, t1.last_name ASC'
            ])
        )
    })

})