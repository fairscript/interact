import {employees, testEmployees} from '@fairscript/interact/lib/test/test_tables'

import * as chai from 'chai'
import * as chaiAsPromised from 'chai-as-promised'
import {createSqliteInMemoryClient} from '../../lib/sqlite_client'
import {createSqliteContext} from '../../lib'
import {setUpSqliteTestData} from '../sqlite_setup'

describe('SqliteContext can aggregate', () => {
    const client = createSqliteInMemoryClient()
    const context = createSqliteContext(client)

    before(async() => {
        chai.should()
        chai.use(chaiAsPromised)

        await setUpSqliteTestData(client)
    })

    describe('a single column', () => {
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

    it('multiple columns', () => {
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

    it('groups', () => {
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