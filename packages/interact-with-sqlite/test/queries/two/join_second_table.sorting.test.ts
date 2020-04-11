import {checkSql} from '../sql_assertion'
import {
    departmentsThenEmployees,
    employeesThenDepartments, expectedDepartmentsThenEmployeesLines,
    expectedEmployeesThenDepartmentsLines
} from './test_joins_of_two_tables'

function testSortingForEmployeesThenDepartments(actual, expected) {
    checkSql(
        actual,
        ['SELECT t1.id'].concat(expectedEmployeesThenDepartmentsLines).concat(expected)
    )
}

function testSortingForDepartmentsThenEmployees(actual, expected) {
    checkSql(
        actual,
        ['SELECT t2.id'].concat(expectedDepartmentsThenEmployeesLines).concat(expected)
    )
}

describe('JoinSecondTable can sort', () => {
    describe('in ascending order by a column', () => {
        it('in the first table', () => {
            testSortingForEmployeesThenDepartments(
                employeesThenDepartments
                    .sortBy(e => e.salary)
                    .get(e => e.id),
                'ORDER BY t1.salary ASC'
            )
        })

        it('in the second table', () => {
            testSortingForDepartmentsThenEmployees(
                departmentsThenEmployees
                    .sortBy((d, e) => e.salary)
                    .get((d, e) => e.id),
                'ORDER BY t2.salary ASC'
            )
        })
    })

    describe('in descending order', () => {
        it('in the first table', () => {
            testSortingForEmployeesThenDepartments(
                employeesThenDepartments
                    .sortDescendinglyBy(e => e.salary)
                    .get(e => e.id),
                'ORDER BY t1.salary DESC'
            )
        })

        it('in the second table', () => {
            testSortingForDepartmentsThenEmployees(
                departmentsThenEmployees
                    .sortDescendinglyBy((d, e) => e.salary)
                    .get((d, e) => e.id),
                'ORDER BY t2.salary DESC'
            )
        })
    })

})