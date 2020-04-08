import {departments, employees} from '../../test_tables'
import {checkSql} from '../sql_assertion'

describe('JoinSecondTable', () => {
    const joinOfTwoTables = employees
        .join(departments, e => e.departmentId, d => d.id)

    it('can count rows', () => {
        checkSql(
            joinOfTwoTables
                .count(),
            [
                'SELECT COUNT(*)',
                'FROM employees t1',
                'INNER JOIN departments t2 ON t1.department_id = t2.id'
            ])
    })

    describe('can get a column from', () => {
        it('the first table', () => {
            checkSql(
                joinOfTwoTables
                    .get((e, d) => e.id),
                [
                    'SELECT t1.id',
                    'FROM employees t1',
                    'INNER JOIN departments t2 ON t1.department_id = t2.id'
                ])
        })

        it('the second table', () => {
            checkSql(
                joinOfTwoTables
                    .get((e, d) => d.id),
                [
                    'SELECT t2.id',
                    'FROM employees t1',
                    'INNER JOIN departments t2 ON t1.department_id = t2.id'
                ])
        })
    })
})