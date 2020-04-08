import {employees} from '../../test_tables'
import {checkSql} from '../sql_assertion'

describe('Table', () => {
    it('can count', () => {
        checkSql(
            employees.count(),
            [
                'SELECT COUNT(*)',
                'FROM employees t1'
            ])
    })

    it('can get a column', () => {
        checkSql(
            employees.get(e => e.id),
            [
                'SELECT t1.id',
                'FROM employees t1'
            ]
        )
    })
})