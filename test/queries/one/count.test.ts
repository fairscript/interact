import {employees} from '../../test_tables'
import {checkSql} from '../sql_assertion'

describe('Counting on a single table', () => {
    it('works without filtering', () => {
        checkSql(
            employees.count(),
            [
                'SELECT COUNT(*)',
                'FROM employees t1'
            ])
    })

    it('works with filtering', () => {
        checkSql(
            employees
                .filter(e => e.departmentId === 1)
                .count(),
            [
                'SELECT COUNT(*)',
                'FROM employees t1',
                'WHERE t1.department_id = 1'
            ])
    })
})