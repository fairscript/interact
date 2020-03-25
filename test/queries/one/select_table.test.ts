import {employees} from '../../test_tables'
import {checkSql} from '../sql_assertion'

describe('Selecting', () => {
    it('all columns corresponding to class properties works', () => {
        checkSql(
            employees.select(),
            [
                'SELECT t1.id, t1.first_name, t1.last_name, t1.title, t1.salary, t1.department_id',
                'FROM employees t1'
            ]
        )
    })
})