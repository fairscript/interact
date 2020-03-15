import * as assert from 'assert'
import {employees} from '../../test_tables'
import {joinWithNewLine} from '../../../lib/parsing/javascript_parsing'

describe('subquery', () => {
    xit('', () => {
        assert.deepEqual(
            employees
                .mapS(employees, (s, e) => ({
                    id: e.id,
                    higherSalary: s.filter(se => se.salary > e.salary).count()
                })),
            joinWithNewLine([
                'SELECT t1.id, (SELECT COUNT(*) FROM employees s1 where s1.salary > t1.salary)',
                'FROM employees t1'
            ])
        )
    })
})
