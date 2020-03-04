import * as assert from 'assert'
import {employees} from '../test_tables'
import {joinWithNewLine} from '../../lib/parsing/parsing'

describe('Grouping', () => {

    it('works on a single field', () => {
        assert.equal(
            employees
                .groupBy(e => ({departmentId: e.departmentId}))
                .toString(),
            joinWithNewLine([
                'FROM employees t1',
                'GROUP BY t1.department_id'
            ])
        )
    })
})