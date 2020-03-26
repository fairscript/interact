import {departments, employees} from '../../test_tables'
import {checkSql} from '../sql_assertion'

describe('Mapping on a join of two tables', () => {
    it('works', () => {
        checkSql(
            employees
                .join(departments, e => e.departmentId, d => d.id)
                .map((e, d) => ({
                    firstName: e.firstName,
                    lastName: e.lastName,
                    department: d.name
                })),
            [
                'SELECT t1.first_name AS "firstName", t1.last_name AS "lastName", t2.name AS "department"',
                'FROM employees t1',
                'INNER JOIN departments t2 ON t1.department_id = t2.id'
            ]
        )
    })
})