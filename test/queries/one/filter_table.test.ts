import {employees} from '../../test_tables'
import {checkSql} from '../sql_assertion'

describe('Filtering', () => {

    it('works for a single predicate', () => {
        checkSql(
            employees
                .filter(e => e.id == 1)
                .select(),
            [
                'SELECT t1.id, t1.first_name, t1.last_name, t1.title, t1.salary, t1.department_id',
                'FROM employees t1',
                'WHERE t1.id = 1'
            ]
        )
    })

    describe('works for a single parameterized predicate', () => {

        it('with a value paramter', () => {
            checkSql(
                employees
                    .filterP(2, (id, e) => e.id == id)
                    .select(),
                [
                    'SELECT t1.id, t1.first_name, t1.last_name, t1.title, t1.salary, t1.department_id',
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
                    .select(),
                [
                    'SELECT t1.id, t1.first_name, t1.last_name, t1.title, t1.salary, t1.department_id',
                    'FROM employees t1',
                    'WHERE t1.first_name = $f1_name_firstName AND t1.last_name = $f1_name_lastName'
                ]
            )
        })
    })

    it('works for a conjunction of two predicates', () => {
        const expectedSelect = "SELECT t1.id, t1.first_name, t1.last_name, t1.title, t1.salary, t1.department_id"
        const expectedFrom = "FROM employees t1"

        checkSql(
            employees
                .filter(e => e.firstName == 'John' && e.lastName == 'Doe')
                .select(),
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
                .select(),
            [
                expectedSelect,
                expectedFrom,
                "WHERE (t1.first_name = 'John') AND (t1.last_name = 'Doe')"
            ]
        )
    })
})