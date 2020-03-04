import * as assert from 'assert'
import {employees} from '../test_tables'
import {joinWithNewLine} from '../../lib/parsing'

describe('Sorting', () => {

    describe('works on a single one order', () => {
        it('in ascending direction', () => {
            assert.equal(
                employees
                    .sortBy(e => e.salary)
                    .map(e => e.id)
                    .toString(),
                joinWithNewLine([
                    'SELECT t1.id',
                    'FROM employees t1',
                    'ORDER BY t1.salary ASC'
                ])
            )
        })

        it('in descending direction', () => {
            assert.equal(
                employees
                    .sortDescendinglyBy(e => e.salary)
                    .map(e => e.id)
                    .toString(),
                joinWithNewLine([
                    'SELECT t1.id',
                    'FROM employees t1',
                    'ORDER BY t1.salary DESC'
                ])
            )
        })
    })

    it('on two orders', () => {
        assert.equal(
            employees
                .sortBy(e => e.lastName)
                .thenBy(e => e.firstName)
                .map(e => e.id)
                .toString(),
            joinWithNewLine([
                'SELECT t1.id',
                'FROM employees t1',
                'ORDER BY t1.last_name ASC, t1.first_name ASC'
            ])
        )
    })

})