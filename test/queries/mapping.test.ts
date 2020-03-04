import * as assert from 'assert'
import {employees} from '../test_tables'
import {joinWithNewLine} from '../../lib/parsing/parsing'

describe('Mapping', () => {
    it('works on a single value', () => {
        assert.equal(
            employees
                .map(e => e.id)
                .toString(),
            joinWithNewLine([
                'SELECT t1.id',
                'FROM employees t1'
            ])
        )
    })

    it('works on an object', () => {
        assert.equal(
            employees
                .map(e => ({ firstName: e.firstName, lastName: e.lastName }))
                .toString(),
            joinWithNewLine([
                'SELECT t1.first_name AS firstName, t1.last_name AS lastName',
                'FROM employees t1'
            ])
        )
    })
})