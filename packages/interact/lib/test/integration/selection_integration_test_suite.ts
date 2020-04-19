import {DatabaseContext} from '../../databases/database_context'
import {testDepartments, testEmployees} from '../test_tables'
import {Table} from '../../queries/one/table'
import {Employee} from '../model/employee'
import {Department} from '../model/department'

export class SelectionIntegrationTestSuite {
    constructor(
        private context: DatabaseContext,
        private employees: Table<Employee>,
        private departments: Table<Department>) {}

    employeesSortedById = this.employees.sortBy(e => e.id)

    testSelectionOfAllRows() {

        it('from a single table', () => {
            return this.context.run(this.employeesSortedById.select())
                .should.eventually.eql(testEmployees)
        })

        it('from two tables', () => {
            const testEmployeesJoinedWithDepartments = testEmployees.map(e => {
                return {
                    'employee': e,
                    'department': testDepartments[testDepartments.findIndex(d => d.id == e.departmentId)]
                }
            })

            const actual = this.context.run(
                this.employees
                    .join(this.departments, e => e.departmentId, d => d.id)
                    .sortBy(e => e.id)
                    .select('employee', 'department')
            )

            return actual.should.eventually.eql(testEmployeesJoinedWithDepartments)
        })
    }

    testLimitedSelection() {
        const limitedSelection = this.employeesSortedById
            .select()
            .limit(2)

        it('without an offset', () => {
            return this.context.run(limitedSelection)
                .should.eventually.eql(testEmployees.slice(0, 2))
        })

        it('with an offset', () => {
            return this.context.run(limitedSelection.offset(1))
                .should.eventually.eql(testEmployees.slice(1, 3))
        })
    }

    testSingleRowSelection() {
        it('from a single table', () => {
            const actual = this.context.run(this.employees.filter(e => e.id === 1).single())

            const expected = testEmployees.filter(e => e.id == 1)[0]

            return actual.should.eventually.eql(expected)
        })

        it('from two tables', () => {
            const actual = this.context.run(
                this.employees
                    .join(this.departments, e => e.departmentId, d => d.id)
                    .filter((e, d) => e.id === 1)
                    .single('employee', 'department')
            )

            const expectedEmployee = testEmployees.filter(e => e.id == 1)[0]
            const expectedDepartment = testDepartments.filter(d => d.id == expectedEmployee.departmentId)[0]
            const expected = {
                employee: expectedEmployee,
                department: expectedDepartment
            }

            return actual.should.eventually.eql(expected)
        })
    }

    testMapSelection() {
        const actual = this.context.run(
            this.employeesSortedById
                .map(e => ({first: e.firstName, last: e.lastName, worksFulltime: e.fulltime}))
        )

        const expected = testEmployees
            .map(e => ({first: e.firstName, last: e.lastName, worksFulltime: e.fulltime}))

        return actual.should.eventually.eql(expected)
    }

    testVectorSelection() {
        const actualSalaries = this.employees.sortBy(e => e.salary).get(e => e.salary)

        const expectedSalaries = testEmployees
            .concat()
            .sort((a, b) => a.salary - b.salary)
            .map(e => e.salary)

        it('with duplicates', () => {
            const actual = this.context.run(actualSalaries)

            return actual.should.eventually.eql(expectedSalaries)
        })

        it('without duplicates', () => {
            const actual = this.context.run(actualSalaries.distinct())

            const expectedDistinctSalaries = expectedSalaries.filter((salary, index) => expectedSalaries.indexOf(salary) === index)

            return actual.should.eventually.eql(expectedDistinctSalaries)
        })
    }

    testScalarSelection() {
        const actual = this.context.run(this.employees.filter(e => e.id === 1).get(e => e.fulltime).single())

        const expected = testEmployees.filter(e => e.id == 1)[0].fulltime

        return actual.should.eventually.equal(expected)
    }

    testRowCountSelection() {
        return this.context.run(this.employees.count())
            .should.eventually.equal(testEmployees.length)
    }
}