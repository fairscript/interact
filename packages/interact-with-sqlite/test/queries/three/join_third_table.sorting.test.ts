import {checkSql} from '../sql_assertion'
import {
    departmentsThenCompaniesThenEmployees,
    departmentsThenEmployeesThenCompanies,
    employeesThenDepartmentsThenCompanies, expectedDepartmentsThenCompaniesThenEmployeesLines,
    expectedDepartmentsThenEmployeesThenCompaniesLines,
    expectedEmployeesThenDepartmentsThenCompaniesLines
} from './test_joins_of_three_tables'

function testSortingForEmployeesThenDepartmentsThenCompanies(actual, expected) {
    checkSql(
        actual,
        ['SELECT t1.id'].concat(expectedEmployeesThenDepartmentsThenCompaniesLines).concat(expected)
    )
}

function testSortingForDepartmentsThenEmployeesThenCompanies(actual, expected) {
    checkSql(
        actual,
        ['SELECT t2.id'].concat(expectedDepartmentsThenEmployeesThenCompaniesLines).concat(expected)
    )
}

function testSelectionForDepartmentsThenCompaniesThenEmployees(actual, expected) {
    checkSql(
        actual,
        ['SELECT t3.id'].concat(expectedDepartmentsThenCompaniesThenEmployeesLines).concat(expected)
    )
}

describe('JoinThirdTable can sort', () => {
    describe('in ascending order by a column', () => {
        it('in the first table', () => {
            testSortingForEmployeesThenDepartmentsThenCompanies(
                employeesThenDepartmentsThenCompanies
                    .sortBy((e, d, c) => e.salary)
                    .get((e, d, c) => e.id),
                'ORDER BY t1.salary ASC'
            )
        })

        it('in the second table', () => {
            testSortingForDepartmentsThenEmployeesThenCompanies(
                departmentsThenEmployeesThenCompanies
                    .sortBy((d, e, c) => e.salary)
                    .get((d, e, c) => e.id),
                'ORDER BY t2.salary ASC'
            )
        })

        it('in the third table', () => {
            testSelectionForDepartmentsThenCompaniesThenEmployees(
                departmentsThenCompaniesThenEmployees
                    .sortBy((d, c, e) => e.salary)
                    .get((d, c, e) => e.id),
                'ORDER BY t3.salary ASC'
            )
        })
    })

    describe('in descending order by a column', () => {
        it('in the first table', () => {
            testSortingForEmployeesThenDepartmentsThenCompanies(
                employeesThenDepartmentsThenCompanies
                    .sortDescendinglyBy((e, d, c) => e.salary)
                    .get((e, d, c) => e.id),
                'ORDER BY t1.salary DESC'
            )
        })

        it('in the second table', () => {
            testSortingForDepartmentsThenEmployeesThenCompanies(
                departmentsThenEmployeesThenCompanies
                    .sortDescendinglyBy((d, e, c) => e.salary)
                    .get((d, e, c) => e.id),
                'ORDER BY t2.salary DESC'
            )
        })

        it('in the third table', () => {
            testSelectionForDepartmentsThenCompaniesThenEmployees(
                departmentsThenCompaniesThenEmployees
                    .sortDescendinglyBy((d, c, e) => e.salary)
                    .get((d, c, e) => e.id),
                'ORDER BY t3.salary DESC'
            )
        })
    })
})