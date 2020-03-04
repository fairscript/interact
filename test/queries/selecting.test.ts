import * as assert from 'assert'
import {employees} from '../test_tables'
import {joinWithNewLine} from '../../lib/parsing'

describe('Selecting', () => {
    it('all fields corresponding to class properties works', () => {
        assert.equal(
            employees
                .select()
                .toString(),
            joinWithNewLine([
                'SELECT t1.id, t1.first_name, t1.last_name, t1.title, t1.salary, t1.department_id',
                'FROM employees t1'
            ])
        )
    })
})