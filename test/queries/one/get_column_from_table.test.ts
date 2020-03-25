import {employees} from '../../test_tables'
import {checkSql} from '../sql_assertion'

describe('Getting', () => {
    it('a number works', () => {
        checkSql(
            employees.get(e => e.id),
            [
                'SELECT t1.id',
                'FROM employees t1'
            ]
        )
    })

    it('a string works', () => {
        checkSql(
            employees.get(e => e.title),
            [
                'SELECT t1.title',
                'FROM employees t1'
            ]
        )
    })
})