import {employees} from '../../test_tables'
import {checkSql} from '../sql_assertion'

describe('Selecting', () => {
    it('all columns corresponding to class properties works', () => {
        checkSql(
            employees.select(),
            [
                'SELECT t1.id AS id, t1.first_name AS firstName, t1.last_name AS lastName, t1.title AS title, t1.salary AS salary, t1.department_id AS departmentId, t1.fulltime AS fulltime',
                'FROM employees t1'
            ]
        )
    })
})