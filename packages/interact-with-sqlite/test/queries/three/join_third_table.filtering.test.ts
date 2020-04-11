import {checkSql, checkSqlAndParameters} from '../sql_assertion'
import {
    companiesThenDepartmentsThenEmployees,
    departmentsThenCompaniesThenEmployees,
    departmentsThenEmployeesThenCompanies,
    employeesThenDepartmentsThenCompanies,
    expectedCompaniesThenDepartmentsThenEmployeesLines,
    expectedDepartmentsThenCompaniesThenEmployeesLines,
    expectedDepartmentsThenEmployeesThenCompaniesLines,
    expectedEmployeesThenDepartmentsThenCompaniesLines
} from './test_joins_of_three_tables'

describe('JoinThirdTable can filter', () => {
    describe('without a parameter based on a column', () => {
        it('in the first table', () => {
            checkSql(
                companiesThenDepartmentsThenEmployees
                    .filter((c, d, e) => c.id === 1)
                    .get((c, d, e) => e.id),
                ['SELECT t3.id'].concat(expectedCompaniesThenDepartmentsThenEmployeesLines).concat('WHERE t1.id = 1')
            )
        })

        it('in the second table', () => {
            checkSql(
                departmentsThenCompaniesThenEmployees
                    .filter((d, c, e) => c.id === 1)
                    .get((d, c, e) => e.id),
                ['SELECT t3.id'].concat(expectedDepartmentsThenCompaniesThenEmployeesLines).concat('WHERE t2.id = 1')
            )
        })

        it('in the third table', () => {
            checkSql(
                employeesThenDepartmentsThenCompanies
                    .filter((e, d, c) => c.id === 1)
                    .get((e, d, c) => e.id),
                ['SELECT t1.id'].concat(expectedEmployeesThenDepartmentsThenCompaniesLines).concat('WHERE t3.id = 1')
            )
        })
    })

    describe('with a user-provided', () => {
        describe('value parameter based on a column', () => {
            const userProvidedParameter = 1
            const expectedParameterRecord = {$f1_id: userProvidedParameter}

            it('in the first second', () => {
                checkSqlAndParameters(
                    companiesThenDepartmentsThenEmployees
                        .filter(userProvidedParameter, (id, c, d, e) => c.id === id)
                        .get((c, d, e) => e.id),
                    ['SELECT t3.id'].concat(expectedCompaniesThenDepartmentsThenEmployeesLines).concat('WHERE t1.id = $f1_id'),
                    expectedParameterRecord)
            })

            it('in the second table', () => {
                checkSqlAndParameters(
                    departmentsThenCompaniesThenEmployees
                        .filter(userProvidedParameter, (id, d, c, e) => c.id === id)
                        .get((d, c, e) => e.id),
                    ['SELECT t3.id'].concat(expectedDepartmentsThenCompaniesThenEmployeesLines).concat('WHERE t2.id = $f1_id'),
                    expectedParameterRecord
                )
            })

            it('in the third table', () => {
                checkSqlAndParameters(
                    employeesThenDepartmentsThenCompanies
                        .filter(userProvidedParameter, (id, e, d, c) => c.id === id)
                        .get((e, d, c) => e.id),
                    ['SELECT t1.id'].concat(expectedEmployeesThenDepartmentsThenCompaniesLines).concat('WHERE t3.id = $f1_id'),
                    expectedParameterRecord
                )
            })
        })

        describe('object parameter based on a column', () => {
            const userProvidedParameter = {firstName: 'John', lastName: 'Doe'}
            const expectedParameterRecord = {$f1_name_firstName: 'John', $f1_name_lastName: 'Doe'}

            it('in the first table', () => {
                checkSqlAndParameters(
                    employeesThenDepartmentsThenCompanies
                        .filter(userProvidedParameter, (name, e, d) => e.firstName === name.firstName && e.lastName === name.lastName)
                        .get((e, d, c) => c.id),
                    ['SELECT t3.id'].concat(expectedEmployeesThenDepartmentsThenCompaniesLines).concat('WHERE t1.first_name = $f1_name_firstName AND t1.last_name = $f1_name_lastName'),
                    expectedParameterRecord
                )
            })

            it('in the second table', () => {
                checkSqlAndParameters(
                    departmentsThenEmployeesThenCompanies
                        .filter(userProvidedParameter, (name, d, e, c) => e.firstName === name.firstName && e.lastName === name.lastName)
                        .get((d, e, c) => c.id),
                    ['SELECT t3.id'].concat(expectedDepartmentsThenEmployeesThenCompaniesLines).concat('WHERE t2.first_name = $f1_name_firstName AND t2.last_name = $f1_name_lastName'),
                    expectedParameterRecord
                )
            })

            it('in the third table', () => {
                checkSqlAndParameters(
                    companiesThenDepartmentsThenEmployees
                        .filter(userProvidedParameter, (name, c, d, e) => e.firstName === name.firstName && e.lastName === name.lastName)
                        .get((c, d, e) => c.id),
                    ['SELECT t1.id'].concat(expectedCompaniesThenDepartmentsThenEmployeesLines).concat('WHERE t3.first_name = $f1_name_firstName AND t3.last_name = $f1_name_lastName'),
                    expectedParameterRecord
                )
            })
        })
    })
})