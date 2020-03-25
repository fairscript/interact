import {departments, employees} from '../../test_tables'
import * as assert from 'assert'
import {joinWithNewLine} from '../../../lib/parsing/parsing_helpers'

describe('Filtering a join of two tables works for a predicate', () => {

    const join = employees
        .join(departments, e => e.departmentId, d => d.id)

    it('that applies to the first table', () => {
        assert.equal(
            join
                .filter((e, d) => e.id === 1)
                .get((e, d) => d.name)
                .toSql()[0],
            joinWithNewLine([
                'SELECT t2.name',
                'FROM employees t1',
                'INNER JOIN departments t2 ON t1.department_id = t2.id',
                'WHERE t1.id = 1'
            ])
        )
    })

    it('that applies to the second table', () => {
        assert.equal(
            join
                .filter((e, d) => d.id === 1)
                .get((e, d) => e.id)
                .toSql()[0],
            joinWithNewLine([
                'SELECT t1.id',
                'FROM employees t1',
                'INNER JOIN departments t2 ON t1.department_id = t2.id',
                'WHERE t2.id = 1'
            ])
        )
    })

    it('that applies to the both tables', () => {
        assert.equal(
            join
                .filter((e, d) => e.lastName === 'Doe' && d.id === 1)
                .get((e, d) => e.id)
                .toSql()[0],
            joinWithNewLine([
                'SELECT t1.id',
                'FROM employees t1',
                'INNER JOIN departments t2 ON t1.department_id = t2.id',
                "WHERE t1.last_name = 'Doe' AND t2.id = 1"
            ])
        )
    })

})