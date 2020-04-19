import {DatabaseContext} from '../../databases/database_context'
import {testEmployees} from '../test_tables'
import {Table} from '../../queries/one/table'
import {Employee} from '../model/employee'
import {SortTable} from '../../queries/one/sort_table'

export class SubqueryIntegrationTestSuite {
    employeesSortedById: SortTable<Employee>

    constructor(
        private context: DatabaseContext,
        private employees: Table<Employee>) {
        this.employeesSortedById = employees.sortBy(e => e.id)
    }

    testCounting() {
        const queryWithSubquery = this.employeesSortedById.map(
            this.employees,
            (st, e) => ({
                id: e.id,
                departmentSize: st.filter(se => se.departmentId === e.departmentId).count()
            }))

        const expected = testEmployees.map(e => ({
            id: e.id,
            departmentSize: testEmployees.filter(se => se.departmentId == e.departmentId).length
        }))

        return this.context.run(queryWithSubquery)
            .should.eventually.eql(expected)
    }

    testMaximization() {
        const queryWithSubquery = this.employeesSortedById.map(
            this.employees,
            (st, e) => ({
                id: e.id,
                highestSalaryInDepartment: st.filter(se => se.departmentId === e.departmentId).max(e => e.salary)
            }))

        const expected = testEmployees.map(e => ({
            id: e.id,
            highestSalaryInDepartment: Math.max(...testEmployees.filter(se => se.departmentId == e.departmentId).map(e => e.salary))
        }))

        return this.context.run(queryWithSubquery)
            .should.eventually.eql(expected)
    }

    testMinimization() {
        const queryWithSubquery = this.employeesSortedById.map(
            this.employees,
            (st, e) => ({
                id: e.id,
                lowestSalaryInDepartment: st.filter(se => se.departmentId === e.departmentId).min(e => e.salary)
            }))

        const expected = testEmployees.map(e => ({
            id: e.id,
            lowestSalaryInDepartment: Math.min(...testEmployees.filter(se => se.departmentId == e.departmentId).map(e => e.salary))
        }))

        return this.context.run(queryWithSubquery)
            .should.eventually.eql(expected)
    }

    testSum() {
        const queryWithSubquery = this.employeesSortedById.map(
            this.employees,
            (st, e) => ({
                id: e.id,
                totalSalariesInDepartment: st.filter(se => se.departmentId === e.departmentId).sum(e => e.salary)
            }))

        const expected = testEmployees.map(e => ({
            id: e.id,
            totalSalariesInDepartment: testEmployees
                .filter(se => se.departmentId == e.departmentId)
                .map(e => e.salary)
                .reduce((sum, salary) => sum + salary, 0.0)
        }))

        return this.context.run(queryWithSubquery)
            .should.eventually.eql(expected)
    }

    testAverage() {
        const queryWithSubquery = this.employeesSortedById.map(
            this.employees,
            (st, e) => ({
                id: e.id,
                averageSalaryInDepartment: st.filter(se => se.departmentId === e.departmentId).average(e => e.salary)
            }))

        const expected = testEmployees.map(e => {
            const departmentSalaries = testEmployees
                .filter(se => se.departmentId == e.departmentId)
                .map(e => e.salary)

            return {
                id: e.id,
                averageSalaryInDepartment: departmentSalaries
                    .reduce((sum, salary) => sum + salary, 0.0) / departmentSalaries.length
            }
        })

        return this.context.run(queryWithSubquery)
            .should.eventually.eql(expected)
    }


}