import * as assert from 'assert'
import {departments, employees} from '../../test_tables'
import {joinWithNewLine} from '../../../lib/parsing/javascript_parsing'

describe('Selecting', () => {
    it('all columns in two tables corresponding to class properties works', () => {
        assert.equal(
            employees
                .join(departments, e => e.departmentId, d => d.id)
                .select('employee', 'department')
                .toSql(),
            joinWithNewLine([
                'SELECT t1.id AS employee_id, t1.first_name AS employee_firstName, t1.last_name AS employee_lastName, t1.title AS employee_title, t1.salary AS employee_salary, t1.department_id AS employee_departmentId, t2.id AS department_id, t2.name AS department_name',
                'FROM employees t1',
                'INNER JOIN departments t2 ON t1.department_id = t2.id'
            ])
        )
    })
})