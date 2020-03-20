import * as assert from 'assert'
import {departments, employees} from '../../test_tables'
import {joinWithNewLine} from '../../../lib/parsing/parsing_helpers'

describe('Getting a single column from a join of table', () => {
    it('works', () => {
        assert.equal(
            employees
                .join(departments, e => e.departmentId, d => d.id)
                .get(e => e.id)
                .toSql(),
            joinWithNewLine([
                'SELECT t1.id',
                'FROM employees t1',
                'INNER JOIN departments t2 ON t1.department_id = t2.id'
            ])
        )
    })
})