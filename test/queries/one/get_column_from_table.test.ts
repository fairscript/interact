import * as assert from 'assert'
import {employees} from '../../test_tables'
import {joinWithNewLine} from '../../../lib/parsing/parsing_helpers'

describe('Getting', () => {
    it('a number works', () => {
        assert.equal(
            employees
                .get(e => e.id)
                .toSql()[0],
            joinWithNewLine([
                'SELECT t1.id',
                'FROM employees t1'
            ])
        )
    })

    it('a string works', () => {
        assert.equal(
            employees
                .get(e => e.title)
                .toSql()[0],
            joinWithNewLine([
                'SELECT t1.title',
                'FROM employees t1'
            ])
        )
    })
})