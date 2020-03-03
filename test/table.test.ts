import {employees} from './test_tables'
import {joinWithNewLine} from '../lib/parsing'
import * as assert from 'assert'

describe('Table', () => {

    it('can be selected', () => {
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

    describe('can be mapped', () => {
        it('to a value', () => {
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

        it('to an object', () => {
            assert.equal(
                employees
                    .map(e => ({ firstName: e.firstName, lastName: e.lastName}))
                    .toString(),
                joinWithNewLine([
                    'SELECT t1.first_name AS firstName, t1.last_name AS lastName',
                    'FROM employees t1'
                ])
            )
        })
    })

    describe('can be filtered', () => {

        it('with one predicate', () => {
            assert.equal(
                employees
                    .filter(e => e.id == 1)
                    .select()
                    .toString(),
                joinWithNewLine([
                    'SELECT t1.id, t1.first_name, t1.last_name, t1.title, t1.salary, t1.department_id',
                    'FROM employees t1',
                    'WHERE t1.id = 1'
                ])
            )
        })

        it('with two predicates', () => {
            const expectedSelect = "SELECT t1.id, t1.first_name, t1.last_name, t1.title, t1.salary, t1.department_id"
            const expectedFrom = "FROM employees t1"

            assert.equal(
                employees
                    .filter(e => e.firstName == 'John' && e.lastName == 'Doe')
                    .select()
                    .toString(),
                joinWithNewLine([
                    expectedSelect,
                    expectedFrom,
                    "WHERE t1.first_name = 'John' AND t1.last_name = 'Doe'"
                ])
            )

            assert.equal(
                employees
                    .filter(e => e.firstName == 'John')
                    .filter(e => e.lastName == 'Doe')
                    .select()
                    .toString(),
                joinWithNewLine([
                    expectedSelect,
                    expectedFrom,
                    "WHERE (t1.first_name = 'John') AND (t1.last_name = 'Doe')"
                ])
            )
        })

    })

    describe('can be sorted', () => {

        describe('by one order', () => {
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

        it('by two orders', () => {
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

})