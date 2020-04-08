import {departments, employees} from '../../test_tables'
import {checkSql} from '../sql_assertion'

describe('Selecting', () => {
    it('all columns in two tables corresponding to class properties works', () => {
        checkSql(
            employees
                .join(departments, e => e.departmentId, d => d.id)
                .select('employee', 'department'),
            [
                'SELECT t1.id AS employee_id, t1.first_name AS employee_firstName, t1.last_name AS employee_lastName, t1.title AS employee_title, t1.salary AS employee_salary, t1.department_id AS employee_departmentId, t1.fulltime AS employee_fulltime, t2.id AS department_id, t2.name AS department_name, t2.company_id AS department_companyId',
                'FROM employees t1',
                'INNER JOIN departments t2 ON t1.department_id = t2.id'
            ]
        )
    })
})