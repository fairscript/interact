import {employees} from '../../test_tables'
import * as assert from 'assert'
import {joinWithNewLine} from '../../../lib/parsing/parsing_helpers'

describe('Filtering', () => {

    it('works for a single predicate', () => {
        assert.equal(
            employees
                .filter(e => e.id == 1)
                .select()
                .toSql(),
            joinWithNewLine([
                'SELECT t1.id, t1.first_name, t1.last_name, t1.title, t1.salary, t1.department_id',
                'FROM employees t1',
                'WHERE t1.id = 1'
            ])
        )
    })

    describe('works for a single parameterized predicate', () => {

        it('with a value paramter', () => {
            assert.equal(
                employees
                    .filterP(2, (id, e) => e.id == id)
                    .select()
                    .toSql(),
                joinWithNewLine([
                    'SELECT t1.id, t1.first_name, t1.last_name, t1.title, t1.salary, t1.department_id',
                    'FROM employees t1',
                    'WHERE t1.id = $f1_id'
                ])
            )
        })

        it('with an object parameter', () => {
            assert.equal(
                employees
                    .filterP(
                        { firstName: 'John', lastName: 'Doe' },
                        (name, e) => e.firstName === name.firstName && e.lastName === name.lastName
                    )
                    .select()
                    .toSql(),
                joinWithNewLine([
                    'SELECT t1.id, t1.first_name, t1.last_name, t1.title, t1.salary, t1.department_id',
                    'FROM employees t1',
                    'WHERE t1.first_name = $f1_name_firstName AND t1.last_name = $f1_name_lastName'
                ])
            )
        })
    })

    it('works for a conjunction of two predicates', () => {
        const expectedSelect = "SELECT t1.id, t1.first_name, t1.last_name, t1.title, t1.salary, t1.department_id"
        const expectedFrom = "FROM employees t1"

        assert.equal(
            employees
                .filter(e => e.firstName == 'John' && e.lastName == 'Doe')
                .select()
                .toSql(),
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
                .toSql(),
            joinWithNewLine([
                expectedSelect,
                expectedFrom,
                "WHERE (t1.first_name = 'John') AND (t1.last_name = 'Doe')"
            ])
        )
    })
})