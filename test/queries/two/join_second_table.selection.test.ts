import {departments, employees} from '../../test_tables'
import {checkSql} from '../sql_assertion'

describe('JoinSecondTable', () => {
    const employeesThenDepartments = employees
        .join(departments, e => e.departmentId, d => d.id)

    const departmentsThenEmployees = departments
        .join(employees, d => d.id, e => e.departmentId)

    it('can count rows', () => {
        checkSql(
            employeesThenDepartments
                .count(),
            [
                'SELECT COUNT(*)',
                'FROM employees t1',
                'INNER JOIN departments t2 ON t1.department_id = t2.id'
            ])
    })

    describe('can get a single column from', () => {
        it('the first table', () => {
            checkSql(
                employeesThenDepartments
                    .get((e, d) => e.id),
                [
                    'SELECT t1.id',
                    'FROM employees t1',
                    'INNER JOIN departments t2 ON t1.department_id = t2.id'
                ])
        })

        it('the second table', () => {
            checkSql(
                employeesThenDepartments
                    .get((e, d) => d.id),
                [
                    'SELECT t2.id',
                    'FROM employees t1',
                    'INNER JOIN departments t2 ON t1.department_id = t2.id'
                ])
        })
    })

    it('can select both tables', () => {
        const firstTable = 't1.id AS employee_id, t1.first_name AS employee_firstName, t1.last_name AS employee_lastName, t1.title AS employee_title, t1.salary AS employee_salary, t1.department_id AS employee_departmentId, t1.fulltime AS employee_fulltime'
        const secondTable = 't2.id AS department_id, t2.name AS department_name, t2.company_id AS department_companyId'

        checkSql(
            employeesThenDepartments
                .select('employee', 'department'),
            [
                `SELECT ${firstTable}, ${secondTable}`,
                'FROM employees t1',
                'INNER JOIN departments t2 ON t1.department_id = t2.id'
            ]
        )
    })

    it('can map', () => {
        checkSql(
            employeesThenDepartments.map((e, d) => ({ firstName: e.firstName, lastName: e.lastName, department: d.name })),
            [
                'SELECT t1.first_name AS firstName, t1.last_name AS lastName, t2.name AS department',
                'FROM employees t1',
                'INNER JOIN departments t2 ON t1.department_id = t2.id'
            ]
        )
    })

    describe('can aggregate', () => {
        describe('a single column', () => {
            describe('from the first table by', () => {
                it('maximization', () => {
                    checkSql(
                        employeesThenDepartments
                            .max(e => e.salary),
                        [
                            'SELECT MAX(t1.salary)',
                            'FROM employees t1',
                            'INNER JOIN departments t2 ON t1.department_id = t2.id'
                        ]
                    )
                })

                it('minimization', () => {
                    checkSql(
                        employeesThenDepartments
                            .min(e => e.salary),
                        [
                            'SELECT MIN(t1.salary)',
                            'FROM employees t1',
                            'INNER JOIN departments t2 ON t1.department_id = t2.id'
                        ]
                    )
                })

                it('averaging', () => {
                    checkSql(
                        employeesThenDepartments
                            .average(e => e.salary),
                        [
                            'SELECT AVG(t1.salary)',
                            'FROM employees t1',
                            'INNER JOIN departments t2 ON t1.department_id = t2.id'
                        ]
                    )
                })

                it('summation', () => {
                    checkSql(
                        employeesThenDepartments
                            .sum(e => e.salary),
                        [
                            'SELECT SUM(t1.salary)',
                            'FROM employees t1',
                            'INNER JOIN departments t2 ON t1.department_id = t2.id'
                        ]
                    )
                })

            })

            describe('from the second table by', () => {
                it('maximization', () => {
                    checkSql(
                        departmentsThenEmployees
                            .max((d, e ) => e.salary),
                        [
                            'SELECT MAX(t2.salary)',
                            'FROM departments t1',
                            'INNER JOIN employees t2 ON t1.id = t2.department_id'
                        ]
                    )
                })

                it('minimization', () => {
                    checkSql(
                        departmentsThenEmployees
                            .min((d, e ) => e.salary),
                        [
                            'SELECT MIN(t2.salary)',
                            'FROM departments t1',
                            'INNER JOIN employees t2 ON t1.id = t2.department_id'
                        ]
                    )
                })

                it('averaging', () => {
                    checkSql(
                        departmentsThenEmployees
                            .average((d, e ) => e.salary),
                        [
                            'SELECT AVG(t2.salary)',
                            'FROM departments t1',
                            'INNER JOIN employees t2 ON t1.id = t2.department_id'
                        ]
                    )
                })

                it('summation', () => {
                    checkSql(
                        departmentsThenEmployees
                            .sum((d, e ) => e.salary),
                        [
                            'SELECT SUM(t2.salary)',
                            'FROM departments t1',
                            'INNER JOIN employees t2 ON t1.id = t2.department_id'
                        ]
                    )
                })
            })
        })

        describe('multiple columns', () => {

            it('from the first table', () => {
                checkSql(
                    employeesThenDepartments
                        .aggregate((e, d, count) => ({ highestSalary: e.salary.max(), lowestSalary: e.salary.min(), averageSalary: e.salary.avg(), totalSalary: e.salary.sum(), salaries: count() })),
                    [
                        'SELECT MAX(t1.salary) AS highestSalary, MIN(t1.salary) AS lowestSalary, AVG(t1.salary) AS averageSalary, SUM(t1.salary) AS totalSalary, COUNT(*) AS salaries',
                        'FROM employees t1',
                        'INNER JOIN departments t2 ON t1.department_id = t2.id'
                    ]
                )
            })

            it('from the second table', () => {
                checkSql(
                    departmentsThenEmployees
                        .aggregate((d, e, count) => ({ highestSalary: e.salary.max(), lowestSalary: e.salary.min(), averageSalary: e.salary.avg(), totalSalary: e.salary.sum(), salaries: count() })),
                    [
                        'SELECT MAX(t2.salary) AS highestSalary, MIN(t2.salary) AS lowestSalary, AVG(t2.salary) AS averageSalary, SUM(t2.salary) AS totalSalary, COUNT(*) AS salaries',
                        'FROM departments t1',
                        'INNER JOIN employees t2 ON t1.id = t2.department_id'
                    ]
                )
            })

        })
    })
})