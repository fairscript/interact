import {setUpSqliteTestData} from '../sqlite_setup'
import {createSqliteInMemoryClient} from '../../lib/sqlite_client'
import {departments, employees, testDepartments, testEmployees} from '@fairscript/interact/lib/test/test_tables'
import {createSqliteContext} from '../../lib'

import * as chai from 'chai'
import * as chaiAsPromised from 'chai-as-promised'

describe('SqliteContext can select', () => {
    const client = createSqliteInMemoryClient()
    const context = createSqliteContext(client)

    before(async() => {
        chai.should()
        chai.use(chaiAsPromised)

        await setUpSqliteTestData(client)
    })

    describe('all rows', () => {
        it('from a single table', () => {
            return context.run(employees.select())
                .should.eventually.eql(testEmployees)
        })

        it('from two tables', () => {
            const testEmployeesJoinedWithDepartments = testEmployees.map(e => {
                return {
                    'employee': e,
                    'department': testDepartments[testDepartments.findIndex(d => d.id == e.departmentId)]
                }
            })

            const actual = context.run(
                employees
                    .join(departments, e => e.departmentId, d => d.id)
                    .select('employee', 'department')
            )

            return actual.should.eventually.eql(testEmployeesJoinedWithDepartments)
        })
    })

    describe('a limited number of rows', () => {
        it('without an offset', () => {
            return context.run(employees.select().limit(2))
                .should.eventually.eql(testEmployees.slice(0, 2))
        })

        it('with an offset', () => {
            return context.run(employees.select().limit(2).offset(1))
                .should.eventually.eql(testEmployees.slice(1, 3))
        })
    })

    describe('a single row', () => {
        it('from a single table', () => {
            const actual = context.run(employees.filter(e => e.id === 1).single())

            const expected = testEmployees.filter(e => e.id == 1)[0]

            return actual.should.eventually.eql(expected)
        })

        it('from two tables table', () => {
            const actual = context.run(
                employees
                    .join(departments, e => e.departmentId, d => d.id)
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

    })

    it('can map rows', () => {
        const actual = context.run(
            employees
                .map(e => ({ first: e.firstName, last: e.lastName, worksFulltime: e.fulltime }))
        )

        const expected = testEmployees
            .map(e => ({ first: e.firstName, last: e.lastName, worksFulltime: e.fulltime }))

        return actual.should.eventually.eql(expected)
    })

    describe('a single column', () => {
        const salaries = testEmployees.map(e => e.salary)

        it('with duplicates', () => {
            const actual = context.run(employees.get(e => e.salary))

            const expected = salaries

            return actual.should.eventually.eql(expected)
        })

        it('without duplicates', () => {
            const actual = context.run(employees.get(e => e.salary).distinct())

            const expected = salaries.filter((salary, index) => salaries.indexOf(salary) === index)

            return actual.should.eventually.eql(expected)
        })
    })

    it('a single value', () => {
        const actual = context.run(employees.filter(e => e.id === 1).get(e => e.fulltime).single())

        const expected = testEmployees.filter(e => e.id == 1)[0].fulltime

        return actual.should.eventually.equal(expected)
    })

    it('the row count', () => {
        return context.run(employees.count())
            .should.eventually.equal(testEmployees.length)
    })
})
