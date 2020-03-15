import * as assert from 'assert'
import {employees} from '../../test_tables'
import {joinWithNewLine} from '../../../lib/parsing/javascript_parsing'

describe('Sorting one table', () => {

    describe('works using a single order', () => {
        it('in ascending direction', () => {
            assert.equal(
                employees
                    .sortBy(e => e.salary)
                    .get(e => e.id)
                    .toSql(),
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
                    .get(e => e.id)
                    .toSql(),
                joinWithNewLine([
                    'SELECT t1.id',
                    'FROM employees t1',
                    'ORDER BY t1.salary DESC'
                ])
            )
        })
    })

    it('works using two orders', () => {
        assert.equal(
            employees
                .sortBy(e => e.lastName)
                .thenBy(e => e.firstName)
                .get(e => e.id)
                .toSql(),
            joinWithNewLine([
                'SELECT t1.id',
                'FROM employees t1',
                'ORDER BY t1.last_name ASC, t1.first_name ASC'
            ])
        )
    })

})