import {companies, departments, employees} from '../../test_tables'
import {checkSql} from '../sql_assertion'

describe('JoinThirdTable', () => {
    const employeesThenDepartmentsThenCompanies = employees
        .join(departments, e => e.departmentId, d => d.id)
        .join(companies, (e, d) => d.companyId, c => c.id)

    const departmentsThenEmployeesThenCompanies = departments
        .join(employees, d => d.id, e => e.departmentId)
        .join(companies, (d, e) => d.companyId, c => c.id)

    const departmentsThenCompaniesThenEmployees = departments
        .join(companies, d => d.companyId, c => c.id)
        .join(employees, (d, c) => d.id, e => e.departmentId)

    it('can count rows', () => {
        checkSql(
            employeesThenDepartmentsThenCompanies
                .count(),
            [
                'SELECT COUNT(*)',
                'FROM employees t1',
                'INNER JOIN departments t2 ON t1.department_id = t2.id',
                'INNER JOIN companies t3 ON t2.company_id = t3.id'
            ])
    })

    describe('can get a single column from', () => {
        it('the first table', () => {
            checkSql(
                employeesThenDepartmentsThenCompanies
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
                employeesThenDepartmentsThenCompanies
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
                employeesThenDepartmentsThenCompanies
                    .get((e, d, c) => c.id),
                [
                    'SELECT t3.id',
                    'FROM employees t1',
                    'INNER JOIN departments t2 ON t1.department_id = t2.id',
                    'INNER JOIN companies t3 ON t2.company_id = t3.id'
                ])
        })
    })

    it('can select all three tables', () => {
        const firstTable = 't1.id AS employee_id, t1.first_name AS employee_firstName, t1.last_name AS employee_lastName, t1.title AS employee_title, t1.salary AS employee_salary, t1.department_id AS employee_departmentId, t1.fulltime AS employee_fulltime'
        const secondTable = 't2.id AS department_id, t2.name AS department_name, t2.company_id AS department_companyId'
        const thirdTable = 't3.id AS company_id, t3.name AS company_name'

        checkSql(
            employeesThenDepartmentsThenCompanies
                .select('employee', 'department', 'company'),
            [
                `SELECT ${firstTable}, ${secondTable}, ${thirdTable}`,
                'FROM employees t1',
                'INNER JOIN departments t2 ON t1.department_id = t2.id',
                'INNER JOIN companies t3 ON t2.company_id = t3.id'
            ]
        )
    })

    it('can map', () => {
        checkSql(
            employeesThenDepartmentsThenCompanies.map((e, d, c) => ({ firstName: e.firstName, lastName: e.lastName, department: d.name, company: c.name })),
            [
                'SELECT t1.first_name AS firstName, t1.last_name AS lastName, t2.name AS department, t3.name AS company',
                'FROM employees t1',
                'INNER JOIN departments t2 ON t1.department_id = t2.id',
                'INNER JOIN companies t3 ON t2.company_id = t3.id'
            ]
        )
    })

    describe('can aggregate', () => {
        describe('a single column', () => {
            describe('from the first table by', () => {
                it('maximization', () => {
                    checkSql(
                        employeesThenDepartmentsThenCompanies
                            .max(e => e.salary),
                        [
                            'SELECT MAX(t1.salary)',
                            'FROM employees t1',
                            'INNER JOIN departments t2 ON t1.department_id = t2.id',
                            'INNER JOIN companies t3 ON t2.company_id = t3.id'
                        ]
                    )
                })

                it('minimization', () => {
                    checkSql(
                        employeesThenDepartmentsThenCompanies
                            .min(e => e.salary),
                        [
                            'SELECT MIN(t1.salary)',
                            'FROM employees t1',
                            'INNER JOIN departments t2 ON t1.department_id = t2.id',
                            'INNER JOIN companies t3 ON t2.company_id = t3.id'
                        ]
                    )
                })

                it('averaging', () => {
                    checkSql(
                        employeesThenDepartmentsThenCompanies
                            .average(e => e.salary),
                        [
                            'SELECT AVG(t1.salary)',
                            'FROM employees t1',
                            'INNER JOIN departments t2 ON t1.department_id = t2.id',
                            'INNER JOIN companies t3 ON t2.company_id = t3.id'
                        ]
                    )
                })

                it('summation', () => {
                    checkSql(
                        employeesThenDepartmentsThenCompanies
                            .sum(e => e.salary),
                        [
                            'SELECT SUM(t1.salary)',
                            'FROM employees t1',
                            'INNER JOIN departments t2 ON t1.department_id = t2.id',
                            'INNER JOIN companies t3 ON t2.company_id = t3.id'
                        ]
                    )
                })

            })

            describe('from the second table by', () => {
                it('maximization', () => {
                    checkSql(
                        departmentsThenEmployeesThenCompanies
                            .max((d, e ) => e.salary),
                        [
                            'SELECT MAX(t2.salary)',
                            'FROM departments t1',
                            'INNER JOIN employees t2 ON t1.id = t2.department_id',
                            'INNER JOIN companies t3 ON t1.company_id = t3.id'
                        ]
                    )
                })

                it('minimization', () => {
                    checkSql(
                        departmentsThenEmployeesThenCompanies
                            .min((d, e ) => e.salary),
                        [
                            'SELECT MIN(t2.salary)',
                            'FROM departments t1',
                            'INNER JOIN employees t2 ON t1.id = t2.department_id',
                            'INNER JOIN companies t3 ON t1.company_id = t3.id'
                        ]
                    )
                })

                it('averaging', () => {
                    checkSql(
                        departmentsThenEmployeesThenCompanies
                            .average((d, e ) => e.salary),
                        [
                            'SELECT AVG(t2.salary)',
                            'FROM departments t1',
                            'INNER JOIN employees t2 ON t1.id = t2.department_id',
                            'INNER JOIN companies t3 ON t1.company_id = t3.id'
                        ]
                    )
                })

                it('summation', () => {
                    checkSql(
                        departmentsThenEmployeesThenCompanies
                            .sum((d, e ) => e.salary),
                        [
                            'SELECT SUM(t2.salary)',
                            'FROM departments t1',
                            'INNER JOIN employees t2 ON t1.id = t2.department_id',
                            'INNER JOIN companies t3 ON t1.company_id = t3.id'
                        ]
                    )
                })
            })

            describe('from the third table by', () => {
                it('maximization', () => {
                    checkSql(
                        departmentsThenCompaniesThenEmployees
                            .max((d, c, e ) => e.salary),
                        [
                            'SELECT MAX(t3.salary)',
                            'FROM departments t1',
                            'INNER JOIN companies t2 ON t1.company_id = t2.id',
                            'INNER JOIN employees t3 ON t1.id = t3.department_id',
                        ]
                    )
                })

                it('minimization', () => {
                    checkSql(
                        departmentsThenCompaniesThenEmployees
                            .min((d, c, e ) => e.salary),
                        [
                            'SELECT MIN(t3.salary)',
                            'FROM departments t1',
                            'INNER JOIN companies t2 ON t1.company_id = t2.id',
                            'INNER JOIN employees t3 ON t1.id = t3.department_id',
                        ]
                    )
                })

                it('averaging', () => {
                    checkSql(
                        departmentsThenCompaniesThenEmployees
                            .average((d, c, e ) => e.salary),
                        [
                            'SELECT AVG(t3.salary)',
                            'FROM departments t1',
                            'INNER JOIN companies t2 ON t1.company_id = t2.id',
                            'INNER JOIN employees t3 ON t1.id = t3.department_id',
                        ]
                    )
                })

                it('summation', () => {
                    checkSql(
                        departmentsThenCompaniesThenEmployees
                            .sum((d, c, e ) => e.salary),
                        [
                            'SELECT SUM(t3.salary)',
                            'FROM departments t1',
                            'INNER JOIN companies t2 ON t1.company_id = t2.id',
                            'INNER JOIN employees t3 ON t1.id = t3.department_id',
                        ]
                    )
                })
            })
        })

        describe('multiple columns', () => {
            it('from the first table', () => {
                checkSql(
                    employeesThenDepartmentsThenCompanies
                        .aggregate((e, d, c,  count) => ({ highestSalary: e.salary.max(), lowestSalary: e.salary.min(), averageSalary: e.salary.avg(), totalSalary: e.salary.sum(), salaries: count() })),
                    [
                        'SELECT MAX(t1.salary) AS highestSalary, MIN(t1.salary) AS lowestSalary, AVG(t1.salary) AS averageSalary, SUM(t1.salary) AS totalSalary, COUNT(*) AS salaries',
                        'FROM employees t1',
                        'INNER JOIN departments t2 ON t1.department_id = t2.id',
                        'INNER JOIN companies t3 ON t2.company_id = t3.id'
                    ]
                )
            })

            it('from the second table', () => {
                checkSql(
                    departmentsThenEmployeesThenCompanies
                        .aggregate((d, e, c, count) => ({ highestSalary: e.salary.max(), lowestSalary: e.salary.min(), averageSalary: e.salary.avg(), totalSalary: e.salary.sum(), salaries: count() })),
                    [
                        'SELECT MAX(t2.salary) AS highestSalary, MIN(t2.salary) AS lowestSalary, AVG(t2.salary) AS averageSalary, SUM(t2.salary) AS totalSalary, COUNT(*) AS salaries',
                        'FROM departments t1',
                        'INNER JOIN employees t2 ON t1.id = t2.department_id',
                        'INNER JOIN companies t3 ON t1.company_id = t3.id'
                    ]
                )
            })

            it('from the third table', () => {
                checkSql(
                    departmentsThenCompaniesThenEmployees
                        .aggregate((d, c, e, count) => ({ highestSalary: e.salary.max(), lowestSalary: e.salary.min(), averageSalary: e.salary.avg(), totalSalary: e.salary.sum(), salaries: count() })),
                    [
                        'SELECT MAX(t3.salary) AS highestSalary, MIN(t3.salary) AS lowestSalary, AVG(t3.salary) AS averageSalary, SUM(t3.salary) AS totalSalary, COUNT(*) AS salaries',
                        'FROM departments t1',
                        'INNER JOIN companies t2 ON t1.company_id = t2.id',
                        'INNER JOIN employees t3 ON t1.id = t3.department_id',
                    ]
                )
            })

        })
    })
})