import * as assert from 'assert'
import {employees} from '../../test_tables'
import {joinWithNewLine} from '../../../lib/parsing/parsing_helpers'

describe('Mapping on a single table', () => {
    it('works for an object', () => {
        assert.equal(
            employees
                .map(e => ({ firstName: e.firstName, lastName: e.lastName }))
                .toSql()[0],
            joinWithNewLine([
                'SELECT t1.first_name AS firstName, t1.last_name AS lastName',
                'FROM employees t1'
            ])
        )
    })
})