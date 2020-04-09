import {checkSql} from '../sql_assertion'
import {
    departmentsThenCompaniesThenEmployees,
    departmentsThenEmployeesThenCompanies,
    employeesThenDepartmentsThenCompanies
} from './test_joins_of_three_tables'

function testSelectionForEmployeesThenDepartmentsThenCompanies(actual, expected) {
    checkSql(
        actual,
        [expected]
            .concat(
                'FROM employees t1',
                'INNER JOIN departments t2 ON t1.department_id = t2.id',
                'INNER JOIN companies t3 ON t2.company_id = t3.id'
            ))
}

function testSelectionForDepartmentsThenEmployeesThenCompanies(actual, expected) {
    checkSql(
        actual,
        [expected]
            .concat(
                'FROM departments t1',
                'INNER JOIN employees t2 ON t1.id = t2.department_id',
                'INNER JOIN companies t3 ON t1.company_id = t3.id'
            ))
}

function testSelectionForDepartmentsThenCompaniesThenEmployees(actual, expected) {
    checkSql(
        actual,
        [expected]
            .concat(
                'FROM departments t1',
                'INNER JOIN companies t2 ON t1.company_id = t2.id',
                'INNER JOIN employees t3 ON t1.id = t3.department_id'
            ))
}


describe('JoinThirdTable', () => {

    it('can count rows', () => {
        testSelectionForEmployeesThenDepartmentsThenCompanies(
            employeesThenDepartmentsThenCompanies
                .count(),
            'SELECT COUNT(*)'
        )
    })

    describe('can get a single column from', () => {
        it('the first table', () => {
            testSelectionForEmployeesThenDepartmentsThenCompanies(
                employeesThenDepartmentsThenCompanies
                    .get((e, d, c) => e.id),
                'SELECT t1.id'
            )
        })

        it('the second table', () => {
            testSelectionForEmployeesThenDepartmentsThenCompanies(
                employeesThenDepartmentsThenCompanies
                    .get((e, d, c) => d.id),
                'SELECT t2.id')
        })

        it('the third table', () => {
            testSelectionForEmployeesThenDepartmentsThenCompanies(
                employeesThenDepartmentsThenCompanies
                    .get((e, d, c) => c.id),
                'SELECT t3.id')
        })
    })

    it('can select all three tables', () => {
        const firstTable = 't1.id AS employee_id, t1.first_name AS employee_firstName, t1.last_name AS employee_lastName, t1.title AS employee_title, t1.salary AS employee_salary, t1.department_id AS employee_departmentId, t1.fulltime AS employee_fulltime'
        const secondTable = 't2.id AS department_id, t2.name AS department_name, t2.company_id AS department_companyId'
        const thirdTable = 't3.id AS company_id, t3.name AS company_name'

        testSelectionForEmployeesThenDepartmentsThenCompanies(
            employeesThenDepartmentsThenCompanies
                .select('employee', 'department', 'company'),
            `SELECT ${firstTable}, ${secondTable}, ${thirdTable}`
        )
    })

    it('can map', () => {
        testSelectionForEmployeesThenDepartmentsThenCompanies(
            employeesThenDepartmentsThenCompanies
                .map((e, d, c) => ({ firstName: e.firstName, lastName: e.lastName, department: d.name, company: c.name })),
            'SELECT t1.first_name AS firstName, t1.last_name AS lastName, t2.name AS department, t3.name AS company'
        )
    })

    describe('can aggregate', () => {
        describe('a single column', () => {
            describe('from the first table by', () => {
                it('maximization', () => {
                    testSelectionForEmployeesThenDepartmentsThenCompanies(
                        employeesThenDepartmentsThenCompanies
                            .max(e => e.salary),
                        'SELECT MAX(t1.salary)'
                    )
                })

                it('minimization', () => {
                    testSelectionForEmployeesThenDepartmentsThenCompanies(
                        employeesThenDepartmentsThenCompanies
                            .min(e => e.salary),
                        'SELECT MIN(t1.salary)'
                    )
                })

                it('averaging', () => {
                    testSelectionForEmployeesThenDepartmentsThenCompanies(
                        employeesThenDepartmentsThenCompanies
                            .average(e => e.salary),
                        'SELECT AVG(t1.salary)'
                    )
                })

                it('summation', () => {
                    testSelectionForEmployeesThenDepartmentsThenCompanies(
                        employeesThenDepartmentsThenCompanies
                            .sum(e => e.salary),
                        'SELECT SUM(t1.salary)'
                    )
                })
            })

            describe('from the second table by', () => {
                it('maximization', () => {
                    testSelectionForDepartmentsThenEmployeesThenCompanies(
                        departmentsThenEmployeesThenCompanies
                            .max((d, e ) => e.salary),
                        'SELECT MAX(t2.salary)',
                    )
                })

                it('minimization', () => {
                    testSelectionForDepartmentsThenEmployeesThenCompanies(
                        departmentsThenEmployeesThenCompanies
                            .min((d, e ) => e.salary),
                        'SELECT MIN(t2.salary)',
                    )
                })

                it('averaging', () => {
                    testSelectionForDepartmentsThenEmployeesThenCompanies(
                        departmentsThenEmployeesThenCompanies
                            .average((d, e ) => e.salary),
                        'SELECT AVG(t2.salary)',
                    )
                })

                it('summation', () => {
                    testSelectionForDepartmentsThenEmployeesThenCompanies(
                        departmentsThenEmployeesThenCompanies
                            .sum((d, e ) => e.salary),
                        'SELECT SUM(t2.salary)',
                    )
                })
            })

            describe('from the third table by', () => {
                it('maximization', () => {
                    testSelectionForDepartmentsThenCompaniesThenEmployees(
                        departmentsThenCompaniesThenEmployees
                            .max((d, c, e ) => e.salary),
                        'SELECT MAX(t3.salary)',
                    )
                })

                it('minimization', () => {
                    testSelectionForDepartmentsThenCompaniesThenEmployees(
                        departmentsThenCompaniesThenEmployees
                            .min((d, c, e ) => e.salary),
                        'SELECT MIN(t3.salary)',
                    )
                })

                it('averaging', () => {
                    testSelectionForDepartmentsThenCompaniesThenEmployees(
                        departmentsThenCompaniesThenEmployees
                            .average((d, c, e ) => e.salary),
                        'SELECT AVG(t3.salary)',
                    )
                })

                it('summation', () => {
                    testSelectionForDepartmentsThenCompaniesThenEmployees(
                        departmentsThenCompaniesThenEmployees
                            .sum((d, c, e ) => e.salary),
                        'SELECT SUM(t3.salary)',
                    )
                })
            })
        })

        describe('multiple columns', () => {
            it('from the first table', () => {
                testSelectionForEmployeesThenDepartmentsThenCompanies(
                    employeesThenDepartmentsThenCompanies
                        .aggregate((e, d, c,  count) => ({ highestSalary: e.salary.max(), lowestSalary: e.salary.min(), averageSalary: e.salary.avg(), totalSalary: e.salary.sum(), salaries: count() })),
                    'SELECT MAX(t1.salary) AS highestSalary, MIN(t1.salary) AS lowestSalary, AVG(t1.salary) AS averageSalary, SUM(t1.salary) AS totalSalary, COUNT(*) AS salaries',
                )
            })

            it('from the second table', () => {
                testSelectionForDepartmentsThenEmployeesThenCompanies(
                    departmentsThenEmployeesThenCompanies
                        .aggregate((d, e, c, count) => ({ highestSalary: e.salary.max(), lowestSalary: e.salary.min(), averageSalary: e.salary.avg(), totalSalary: e.salary.sum(), salaries: count() })),
                    'SELECT MAX(t2.salary) AS highestSalary, MIN(t2.salary) AS lowestSalary, AVG(t2.salary) AS averageSalary, SUM(t2.salary) AS totalSalary, COUNT(*) AS salaries',
                )
            })

            it('from the third table', () => {
                testSelectionForDepartmentsThenCompaniesThenEmployees(
                    departmentsThenCompaniesThenEmployees
                        .aggregate((d, c, e, count) => ({ highestSalary: e.salary.max(), lowestSalary: e.salary.min(), averageSalary: e.salary.avg(), totalSalary: e.salary.sum(), salaries: count() })),
                    'SELECT MAX(t3.salary) AS highestSalary, MIN(t3.salary) AS lowestSalary, AVG(t3.salary) AS averageSalary, SUM(t3.salary) AS totalSalary, COUNT(*) AS salaries',
                )
            })

        })
    })
})