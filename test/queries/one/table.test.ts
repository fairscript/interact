import {checkSql} from '../sql_assertion'
import {employees} from '../../test_tables'

describe('Table', () => {

    describe('can aggregate rows', () => {
        it('to count the number of rows', () => {
            checkSql(
                employees
                    .count(),
                [
                    'SELECT COUNT(*)',
                    'FROM employees t1'
                ]
            )
        })

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

    })

})