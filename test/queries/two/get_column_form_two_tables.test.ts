import {departments, employees} from '../../test_tables'
import {checkSql} from '../sql_assertion'

describe('Getting a single column from a join of table', () => {
    it('works', () => {
        checkSql(
            employees
                .join(departments, e => e.departmentId, d => d.id)
                .get(e => e.id),
            [
                'SELECT t1.id',
                'FROM employees t1',
                'INNER JOIN departments t2 ON t1.department_id = t2.id'
            ]
        )
    })
})