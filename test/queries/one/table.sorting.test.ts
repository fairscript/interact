import {employees} from '../../test_tables'
import {checkSql} from '../sql_assertion'

describe('Sorting one table', () => {
    describe('works using a single order', () => {
        it('in ascending direction', () => {
            checkSql(
                employees
                    .sortBy(e => e.salary)
                    .get(e => e.id),
                [
                    'SELECT t1.id',
                    'FROM employees t1',
                    'ORDER BY t1.salary ASC'
                ]
            )
        })

        it('in descending direction', () => {
            checkSql(
                employees
                    .sortDescendinglyBy(e => e.salary)
                    .get(e => e.id),
                [
                    'SELECT t1.id',
                    'FROM employees t1',
                    'ORDER BY t1.salary DESC'
                ]
            )
        })
    })
})