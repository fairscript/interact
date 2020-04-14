import {setUpSqliteTestData} from '../sqlite_setup'
import {createSqliteInMemoryClient} from '../../lib/sqlite_client'
import {departments, employees, testDepartments, testEmployees} from '@fairscript/interact/lib/test/test_tables'
import {createSqliteContext} from '../../lib'

import * as chai from 'chai'
import * as chaiAsPromised from 'chai-as-promised'

describe('SqliteContext', () => {
    const client = createSqliteInMemoryClient()
    const context = createSqliteContext(client)

    before(async() => {
        chai.should()
        chai.use(chaiAsPromised)

        await setUpSqliteTestData(client)
    })

    describe('can return all rows', () => {
        it('from a single table', () => {
            return context.run(employees.select())
                .should.eventually.eql(testEmployees)
        })

        it('from two tables', () => {
            const actual = context.run(
                employees
                    .join(departments, e => e.departmentId, d => d.id)
                    .select('employee', 'department')
            )

            const expected = testEmployees.map(e => {
                return {
                    'employee': e,
                    'department': testDepartments[testDepartments.findIndex(d => d.id == e.departmentId)]
                }
            })

            return actual.should.eventually.eql(expected)
        })
    })

    it('can return a limited number of rows', () => {
        return context.run(employees.select().limit(2))
            .should.eventually.eql(testEmployees.slice(0, 2))
    })

    it('can return a limited number of rows and skip some', () => {
        return context.run(employees.select().limit(2).offset(1))
            .should.eventually.eql(testEmployees.slice(1, 3))
    })

    it('can count the number of rows', () => {
        return context.run(employees.count())
            .should.eventually.equal(testEmployees.length)
    })

    describe('can return a single row', () => {
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

    describe('can return a single column', () => {
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

    it('can return a single value', () => {
        const actual = context.run(employees.filter(e => e.id === 1).get(e => e.fulltime).single())

        const expected = testEmployees.filter(e => e.id == 1)[0].fulltime

        return actual.should.eventually.equal(expected)
    })

    describe('can aggregate a single column', () => {
        const salaries = testEmployees.map(e => e.salary)

        it('by maximization', () => {
            const actual = context.run(employees.max(e => e.salary))

            const expected = Math.max(...salaries)

            return actual.should.eventually.equal(expected)
        })

        it('by minimization', () => {
            const actual = context.run(employees.min(e => e.salary))

            const expected = Math.min(...salaries)

            return actual.should.eventually.equal(expected)
        })

        it('by summation', () => {
            const actual = context.run(employees.sum(e => e.salary))

            const expected = salaries.reduce((sum, salary) => sum + salary, 0.0)

            return actual.should.eventually.equal(expected)
        })

        it('by averaging', () => {
            const actual = context.run(employees.average(e => e.salary))

            const expected = salaries.reduce((sum, salary) => sum + salary, 0.0) / salaries.length

            return actual.should.eventually.equal(expected)
        })
    })

    it('can aggregate a table', () => {
        const actual = context.run(employees.aggregate(e => ({minimumFulltime: e.fulltime.min(), maximumFulltime: e.fulltime.max()})))

        const fulltimeAsIntegers = testEmployees.map(e => e.fulltime ? 1 : 0)
        const minimumFulltime = Math.min(...fulltimeAsIntegers) === 1
        const maximumFulltime = Math.max(...fulltimeAsIntegers) === 1

        const expected = {
            minimumFulltime,
            maximumFulltime
        }

        return actual.should.eventually.eql(expected)
    })

    it('can aggregate groups', () => {
        function groupBy<T, K extends string|number>(arr: T[], getKey: (item: T) => K): [K, T[]][] {
            return arr.reduce(
                (groups, item) => {
                    const key = getKey(item)

                    const groupIndex = groups.findIndex(g => g[0] === key)

                    if (groupIndex === -1) {
                        groups.push([key, [item]])
                    }
                    else {
                        groups[groupIndex][1].push(item)
                    }

                    return groups
                },
                [] as [K, T[]][])
        }

        const expected = groupBy(testEmployees, e => e.departmentId)
            .map(([key, es]) => {
                const salaries = es.map(e => e.salary)
                const sum = salaries.reduce((acc, salary) => acc + salary, 0.0)
                const count = es.length

                return {
                    department: key,
                    count,
                    maximum: Math.max(...salaries),
                    minimum: Math.min(...salaries),
                    sum,
                    average: sum / count
                }
            })

        const actual = context.run(employees
            .groupBy(e => ({department: e.departmentId}))
            .aggregate((key, g, count) => ({
                department: key.department,
                count: count(),
                maximum: g.salary.max(),
                minimum: g.salary.min(),
                sum: g.salary.sum(),
                average: g.salary.avg()
            })))

        actual.should.eventually.eql(expected)
    })
})
