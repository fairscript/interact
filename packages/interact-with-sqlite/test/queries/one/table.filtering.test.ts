import {employees} from '@fairscript/interact'
import {checkSql, checkSqlAndParameters} from '../sql_assertion'

describe('Table can filter', () => {
    it('without a user-provided parameter', () => {
        checkSql(
            employees
                .filter(e => e.id === 1)
                .get(e => e.salary),
            [
                'SELECT t1.salary',
                'FROM employees t1',
                'WHERE t1.id = 1'
            ]
        )
    })

    describe('with a user-provided', () => {
        it('value parameter', () => {
            checkSqlAndParameters(
                employees
                    .filter(1, (id, e) => e.id == id)
                    .get(e => e.salary),
                [
                    'SELECT t1.salary',
                    'FROM employees t1',
                    'WHERE t1.id = $f1_id'
                ],
                {$f1_id: 1}
            )
        })

        it('object parameter', () => {
            checkSqlAndParameters(
                employees
                    .filter(
                        { firstName: 'John', lastName: 'Doe' },
                        (name, e) => e.firstName === name.firstName && e.lastName === name.lastName
                    )
                    .get(e => e.id),
                [
                    'SELECT t1.id',
                    'FROM employees t1',
                    'WHERE t1.first_name = $f1_name_firstName AND t1.last_name = $f1_name_lastName'
                ],
                {$f1_name_firstName: 'John', $f1_name_lastName: 'Doe'}
            )
        })
    })
})