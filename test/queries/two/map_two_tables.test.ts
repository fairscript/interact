import * as assert from 'assert'
import {departments, employees} from '../../test_tables'
import {joinWithNewLine} from '../../../lib/parsing/javascript_parsing'

describe('Mapping on joined two tables', () => {
    const join = employees
        .join(departments, e => e.departmentId, d => d.id)

    it('works for a single value', () => {
        assert.equal(
            join
                .map(e => e.id)
                .toSql(),
            joinWithNewLine([
                'SELECT t1.id',
                'FROM employees t1',
                'INNER JOIN departments t2 ON t1.department_id = t2.id'
            ])
        )
    })

    it('works for an object', () => {
        assert.equal(
            employees
                .join(departments, e => e.departmentId, d => d.id)
                .map((e, d) => ({
                    firstName: e.firstName,
                    lastName: e.lastName,
                    department: d.name
                }))
                .toSql(),
            joinWithNewLine([
                'SELECT t1.first_name AS firstName, t1.last_name AS lastName, t2.name AS department',
                'FROM employees t1',
                'INNER JOIN departments t2 ON t1.department_id = t2.id'
            ])
        )
    })
})