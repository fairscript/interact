import {departments, employees} from '../../test_tables'
import {checkSql} from '../sql_assertion'


const employeesThenDepartments = employees
    .join(departments, e => e.departmentId, d => d.id)

function testSelectionForEmployeesThenDepartments(actual, expected) {
    checkSql(
        actual,
        [expected]
            .concat(
                'FROM employees t1',
                'INNER JOIN departments t2 ON t1.department_id = t2.id'
            ))
}

const departmentsThenEmployees = departments
    .join(employees, d => d.id, e => e.departmentId)

function testSelectionForDepartmentsThenEmployees(actual, expected) {
    checkSql(
        actual,
        [expected]
            .concat(
                'FROM departments t1',
                'INNER JOIN employees t2 ON t1.id = t2.department_id'
            ))
}

describe('JoinSecondTable', () => {
    it('can count rows', () => {
        testSelectionForEmployeesThenDepartments(
            employeesThenDepartments
                .count(),
            'SELECT COUNT(*)')
    })

    describe('can get a single column from', () => {
        it('the first table', () => {
            testSelectionForEmployeesThenDepartments(
                employeesThenDepartments
                    .get((e, d) => e.id),
                'SELECT t1.id'
            )
        })

        it('the second table', () => {
            testSelectionForEmployeesThenDepartments(
                employeesThenDepartments
                    .get((e, d) => d.id),
                'SELECT t2.id'
            )
        })
    })

    it('can select both tables', () => {
        const firstTable = 't1.id AS employee_id, t1.first_name AS employee_firstName, t1.last_name AS employee_lastName, t1.title AS employee_title, t1.salary AS employee_salary, t1.department_id AS employee_departmentId, t1.fulltime AS employee_fulltime'
        const secondTable = 't2.id AS department_id, t2.name AS department_name, t2.company_id AS department_companyId'

        testSelectionForEmployeesThenDepartments(
            employeesThenDepartments
                .select('employee', 'department'),
            `SELECT ${firstTable}, ${secondTable}`
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
                    testSelectionForEmployeesThenDepartments(
                        employeesThenDepartments
                            .max(e => e.salary),
                            'SELECT MAX(t1.salary)'
                    )
                })

                it('minimization', () => {
                    testSelectionForEmployeesThenDepartments(
                        employeesThenDepartments
                            .min(e => e.salary),
                        'SELECT MIN(t1.salary)')
                })

                it('averaging', () => {
                    testSelectionForEmployeesThenDepartments(
                        employeesThenDepartments
                            .average(e => e.salary),
                        'SELECT AVG(t1.salary)')
                })

                it('summation', () => {
                    testSelectionForEmployeesThenDepartments(
                        employeesThenDepartments
                            .sum(e => e.salary),
                        'SELECT SUM(t1.salary)')
                })

            })

            describe('from the second table by', () => {
                it('maximization', () => {
                    testSelectionForDepartmentsThenEmployees(
                        departmentsThenEmployees
                            .max((d, e) => e.salary),
                        'SELECT MAX(t2.salary)'
                    )
                })

                it('minimization', () => {
                    testSelectionForDepartmentsThenEmployees(
                        departmentsThenEmployees
                            .min((d, e) => e.salary),
                        'SELECT MIN(t2.salary)')
                })

                it('averaging', () => {
                    testSelectionForDepartmentsThenEmployees(
                        departmentsThenEmployees
                            .average((d, e) => e.salary),
                        'SELECT AVG(t2.salary)')
                })

                it('summation', () => {
                    testSelectionForDepartmentsThenEmployees(
                        departmentsThenEmployees
                            .sum((d, e) => e.salary),
                        'SELECT SUM(t2.salary)')
                })
            })
        })

        describe('multiple columns', () => {
            it('from the first table', () => {
                testSelectionForEmployeesThenDepartments(
                    employeesThenDepartments
                        .aggregate((e, d, count) => ({ highestSalary: e.salary.max(), lowestSalary: e.salary.min(), averageSalary: e.salary.avg(), totalSalary: e.salary.sum(), salaries: count() })),
                    'SELECT MAX(t1.salary) AS highestSalary, MIN(t1.salary) AS lowestSalary, AVG(t1.salary) AS averageSalary, SUM(t1.salary) AS totalSalary, COUNT(*) AS salaries',
                )
            })

            it('from the second table', () => {
                testSelectionForDepartmentsThenEmployees(
                    departmentsThenEmployees
                        .aggregate((d, e, count) => ({ highestSalary: e.salary.max(), lowestSalary: e.salary.min(), averageSalary: e.salary.avg(), totalSalary: e.salary.sum(), salaries: count() })),
                    'SELECT MAX(t2.salary) AS highestSalary, MIN(t2.salary) AS lowestSalary, AVG(t2.salary) AS averageSalary, SUM(t2.salary) AS totalSalary, COUNT(*) AS salaries',
                )
            })
        })
    })
})