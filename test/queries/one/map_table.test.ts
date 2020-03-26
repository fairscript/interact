import {employees} from '../../test_tables'
import {checkSql} from '../sql_assertion'

describe('Mapping on a single table', () => {
    it('works for an object', () => {
        checkSql(
            employees.map(e => ({ firstName: e.firstName, lastName: e.lastName })),
            [
                'SELECT t1.first_name AS "firstName", t1.last_name AS "lastName"',
                'FROM employees t1'
            ]
        )
    })
})