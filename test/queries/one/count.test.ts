import * as assert from 'assert'
import {employees} from '../../test_tables'
import {joinWithNewLine} from '../../../lib/parsing/javascript_parsing'

describe('Counting on a single table', () => {
    it('works without filtering', () => {
        assert.equal(
            employees
                .count()
                .toSql(),
            joinWithNewLine([
                'SELECT COUNT(*)',
                'FROM employees t1'
            ])
        )
    })

    it('works with filtering', () => {
        assert.equal(
            employees
                .filter(e => e.departmentId === 1)
                .count()
                .toSql(),
            joinWithNewLine([
                'SELECT COUNT(*)',
                'FROM employees t1',
                'WHERE t1.department_id = 1'
            ])
        )
    })
})