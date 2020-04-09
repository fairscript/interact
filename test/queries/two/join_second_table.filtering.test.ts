import {checkSql, checkSqlAndParameters} from '../sql_assertion'
import {
    departmentsThenEmployees,
    employeesThenDepartments,
    expectedDepartmentsThenEmployeesLines,
    expectedEmployeesThenDepartmentsLines
} from './test_joins_of_two_tables'

describe('JoinSecondTable can filter', () => {
    describe('without a parameter based on a column', () => {
        it('in the first table', () => {
            checkSql(
                departmentsThenEmployees
                    .filter((d, e) => d.id === 1)
                    .get((d, e) => e.id),
                ['SELECT t2.id'].concat(expectedDepartmentsThenEmployeesLines).concat('WHERE t1.id = 1')
            )
        })

        it('in the second table', () => {
            checkSql(
                employeesThenDepartments
                    .filter((e, d) => d.id === 1)
                    .get((e, d) => e.id),
                ['SELECT t1.id'].concat(expectedEmployeesThenDepartmentsLines).concat('WHERE t2.id = 1')
            )
        })
    })

    describe('with a user-provided', () => {
        describe('value parameter based on a column', () => {
            const userProvidedParameter = 1
            const expectedParameterRecord = {$f1_id: userProvidedParameter}

            it('in the first second', () => {
                checkSqlAndParameters(
                    departmentsThenEmployees
                        .filter(userProvidedParameter, (id, d, e) => d.id === id)
                        .get((d, e) => e.id),
                    ['SELECT t2.id'].concat(expectedDepartmentsThenEmployeesLines).concat('WHERE t1.id = $f1_id'),
                    expectedParameterRecord)
            })

            it('in the second table', () => {
                checkSqlAndParameters(
                    employeesThenDepartments
                        .filter(userProvidedParameter, (id, e, d) => d.id === id)
                        .get((e, d) => e.id),
                    ['SELECT t1.id'].concat(expectedEmployeesThenDepartmentsLines).concat('WHERE t2.id = $f1_id'),
                    expectedParameterRecord
                )
            })
        })

        describe('object parameter based on a column', () => {
            const userProvidedParameter = {firstName: 'John', lastName: 'Doe'}
            const expectedParameterRecord = {$f1_name_firstName: 'John', $f1_name_lastName: 'Doe'}

            it('in the first table', () => {
                checkSqlAndParameters(
                    employeesThenDepartments
                        .filter(userProvidedParameter, (name, e, d) => e.firstName === name.firstName && e.lastName === name.lastName)
                        .get((e, d) => d.id),
                    ['SELECT t2.id'].concat(expectedEmployeesThenDepartmentsLines).concat('WHERE t1.first_name = $f1_name_firstName AND t1.last_name = $f1_name_lastName'),
                    expectedParameterRecord
                )
            })

            it('in the second table', () => {
                checkSqlAndParameters(
                    departmentsThenEmployees
                        .filter(userProvidedParameter, (name, d, e) => e.firstName === name.firstName && e.lastName === name.lastName)
                        .get((d, e) => d.id),
                    ['SELECT t1.id'].concat(expectedDepartmentsThenEmployeesLines).concat('WHERE t2.first_name = $f1_name_firstName AND t2.last_name = $f1_name_lastName'),
                    expectedParameterRecord
                )
            })
        })
    })
})