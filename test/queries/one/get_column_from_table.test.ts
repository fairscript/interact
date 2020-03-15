import * as assert from 'assert'
import {employees} from '../../test_tables'
import {joinWithNewLine} from '../../../lib/parsing/javascript_parsing'

describe('Getting', () => {
    it('a number works', () => {
        assert.equal(
            employees
                .get(e => e.id)
                .toSql(),
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
                .toSql(),
            joinWithNewLine([
                'SELECT t1.title',
                'FROM employees t1'
            ])
        )
    })
})