import {companies, departments, employees} from '../../test_tables'
import {checkSql} from '../sql_assertion'

describe('JoinThirdTable', () => {
    const joinOfThreeTables = employees
        .join(departments, e => e.departmentId, d => d.id)
        .join(companies, (e, d) => d.companyId, c => c.id)

    it('can count rows', () => {
        checkSql(
            joinOfThreeTables
                .count(),
            [
                'SELECT COUNT(*)',
                'FROM employees t1',
                'INNER JOIN departments t2 ON t1.department_id = t2.id',
                'INNER JOIN companies t3 ON t2.company_id = t3.id'
            ])
    })

    describe('can get a column from', () => {
        it('the first table', () => {
            checkSql(
                joinOfThreeTables
                    .get((e, d, c) => e.id),
                [
                    'SELECT t1.id',
                    'FROM employees t1',
                    'INNER JOIN departments t2 ON t1.department_id = t2.id',
                    'INNER JOIN companies t3 ON t2.company_id = t3.id'
                ])
        })

        it('the second table', () => {
            checkSql(
                joinOfThreeTables
                    .get((e, d, c) => d.id),
                [
                    'SELECT t2.id',
                    'FROM employees t1',
                    'INNER JOIN departments t2 ON t1.department_id = t2.id',
                    'INNER JOIN companies t3 ON t2.company_id = t3.id'
                ])
        })

        it('the third table', () => {
            checkSql(
                joinOfThreeTables
                    .get((e, d, c) => c.id),
                [
                    'SELECT t3.id',
                    'FROM employees t1',
                    'INNER JOIN departments t2 ON t1.department_id = t2.id',
                    'INNER JOIN companies t3 ON t2.company_id = t3.id'
                ])
        })
    })
})