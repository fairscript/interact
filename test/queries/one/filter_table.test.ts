import {employees} from '../../test_tables'
import {checkSql} from '../sql_assertion'

describe('Filtering', () => {

    it('works for a single predicate', () => {
        checkSql(
            employees
                .filter(e => e.id == 1)
                .get(e => e.salary),
            [
                'SELECT t1.salary',
                'FROM employees t1',
                'WHERE t1.id = 1'
            ]
        )
    })

    describe('works for a single parameterized predicate', () => {

        it('with a value parameter', () => {
            checkSql(
                employees
                    .filterP(2, (id, e) => e.id == id)
                    .get(e => e.salary),
                [
                    'SELECT t1.salary',
                    'FROM employees t1',
                    'WHERE t1.id = $f1_id'
                ]
            )
        })

        it('with an object parameter', () => {
            checkSql(
                employees
                    .filterP(
                        { firstName: 'John', lastName: 'Doe' },
                        (name, e) => e.firstName === name.firstName && e.lastName === name.lastName
                    )
                    .get(e => e.id),
                [
                    'SELECT t1.id',
                    'FROM employees t1',
                    'WHERE t1.first_name = $f1_name_firstName AND t1.last_name = $f1_name_lastName'
                ]
            )
        })
    })

    it('works for a conjunction of two predicates', () => {
        const expectedSelect = "SELECT t1.id"
        const expectedFrom = "FROM employees t1"

        checkSql(
            employees
                .filter(e => e.firstName == 'John' && e.lastName == 'Doe')
                .get(e => e.id),
            [
                expectedSelect,
                expectedFrom,
                "WHERE t1.first_name = 'John' AND t1.last_name = 'Doe'"
            ]
        )

        checkSql(
            employees
                .filter(e => e.firstName == 'John')
                .filter(e => e.lastName == 'Doe')
                .get(e => e.id),
            [
                expectedSelect,
                expectedFrom,
                "WHERE (t1.first_name = 'John') AND (t1.last_name = 'Doe')"
            ]
        )
    })
})