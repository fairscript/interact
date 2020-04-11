import {employees} from '@fairscript/interact'
import {checkSql} from '../sql_assertion'

describe('Table', () => {
    it('can count', () => {
        checkSql(
            employees.count(),
            [
                'SELECT COUNT(*)',
                'FROM employees t1'
            ])
    })

    it('can get a single column', () => {
        checkSql(
            employees.get(e => e.id),
            [
                'SELECT t1.id',
                'FROM employees t1'
            ]
        )
    })

    it('can select all columns', () => {
        checkSql(
            employees.select(),
            [
                'SELECT t1.id AS id, t1.first_name AS firstName, t1.last_name AS lastName, t1.title AS title, t1.salary AS salary, t1.department_id AS departmentId, t1.fulltime AS fulltime',
                'FROM employees t1'
            ]
        )
    })

    it('can map', () => {
        checkSql(
            employees.map(e => ({ firstName: e.firstName, lastName: e.lastName })),
            [
                'SELECT t1.first_name AS firstName, t1.last_name AS lastName',
                'FROM employees t1'
            ]
        )
    })

    describe('can aggregate', () => {
        describe('a single column by', () => {
            it('maximization', () => {
                checkSql(
                    employees
                        .max(e => e.salary),
                    [
                        'SELECT MAX(t1.salary)',
                        'FROM employees t1'
                    ]
                )
            })

            it('minimization', () => {
                checkSql(
                    employees
                        .min(e => e.salary),
                    [
                        'SELECT MIN(t1.salary)',
                        'FROM employees t1'
                    ]
                )
            })

            it('averaging', () => {
                checkSql(
                    employees
                        .average(e => e.salary),
                    [
                        'SELECT AVG(t1.salary)',
                        'FROM employees t1'
                    ]
                )
            })

            it('summation', () => {
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

        it('multiple columns', () => {
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