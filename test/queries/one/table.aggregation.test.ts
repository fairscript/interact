import {checkSql} from '../sql_assertion'
import {employees} from '../../test_tables'

describe('Table', () => {

    describe('can aggregate rows', () => {
        it('to find the maximum of a column', () => {
            checkSql(
                employees
                    .max(e => e.salary),
                [
                    'SELECT MAX(t1.salary)',
                    'FROM employees t1'
                ]
            )
        })

        it('to find the minimum of a column', () => {
            checkSql(
                employees
                    .min(e => e.salary),
                [
                    'SELECT MIN(t1.salary)',
                    'FROM employees t1'
                ]
            )
        })

        it('to find the average of a column', () => {
            checkSql(
                employees
                    .average(e => e.salary),
                [
                    'SELECT AVG(t1.salary)',
                    'FROM employees t1'
                ]
            )
        })

        it('to sum the values in a column', () => {
            checkSql(
                employees
                    .sum(e => e.salary),
                [
                    'SELECT SUM(t1.salary)',
                    'FROM employees t1'
                ]
            )
        })

        it('to return an object', () => {
            checkSql(
                employees
                    .aggregate((e, count) => ({ highestSalary: e.salary.max(), lowestSalary: e.salary.min(), averageSalary: e.salary.avg(), totalSalary: e.salary.sum(), salaries: count() })),
                [
                    'SELECT MAX(t1.salary) AS highestSalary, MIN(t1.salary) AS lowestSalary, AVG(t1.salary) AS averageSalary, SUM(t1.salary) AS totalSalary, COUNT(*) AS salaries',
                    'FROM employees t1'
                ]
            )
        })
    })
})