import {DatabaseContext} from '../../databases/database_context'
import {testEmployees} from '../test_tables'
import {Table} from '../../queries/one/table'
import {Employee} from '../model/employee'

export class AggregationIntegrationTestSuite {
    constructor(private context: DatabaseContext, private employees: Table<Employee>) {}

    testNumericColumnAggregation() {
        const salaries = testEmployees.map(e => e.salary)

        it('by maximization', () => {
            const actual = this.context.run(this.employees.max(e => e.salary))

            const expected = Math.max(...salaries)

            return actual.should.eventually.equal(expected)
        })

        it('by minimization', () => {
            const actual = this.context.run(this.employees.min(e => e.salary))

            const expected = Math.min(...salaries)

            return actual.should.eventually.equal(expected)
        })

        it('by summation', () => {
            const actual = this.context.run(this.employees.sum(e => e.salary))

            const expected = salaries.reduce((sum, salary) => sum + salary, 0.0)

            return actual.should.eventually.equal(expected)
        })

        it('by averaging', () => {
            const actual = this.context.run(this.employees.average(e => e.salary))

            const expected = salaries.reduce((sum, salary) => sum + salary, 0.0) / salaries.length

            return actual.should.eventually.equal(expected)
        })
    }

    testBooleanColumnAggregation() {
        const fulltimeAsNumbers: number[] = testEmployees.map(e => e.fulltime).map(fulltime => fulltime ? 1.0 : 0.0)

        it('by maximization', () => {
            const actual = this.context.run(this.employees.max(e => e.fulltime))

            const expected = Math.max(...fulltimeAsNumbers)

            return actual.should.eventually.equal(expected === 1.0)
        })

        it('by minimization', () => {
            const actual = this.context.run(this.employees.min(e => e.fulltime))

            const expected = Math.min(...fulltimeAsNumbers)

            return actual.should.eventually.equal(expected === 1.0)
        })

        it('by summation', () => {
            const actual = this.context.run(this.employees.sum(e => e.fulltime))

            const expected = fulltimeAsNumbers.reduce((sum, item) => sum + item, 0.0)

            return actual.should.eventually.equal(expected)
        })

        it('by averaging', () => {
            const actual = this.context.run(this.employees.average(e => e.fulltime))

            const expected = fulltimeAsNumbers.reduce((sum, item) => sum + item, 0.0) / fulltimeAsNumbers.length

            return actual.should.eventually.equal(expected)
        })
    }

    testMultiColumnAggregation() {
        const actual = this.context.run(this.employees.aggregate(e => ({minimumFulltime: e.fulltime.min(), maximumFulltime: e.fulltime.max()})))

        const fulltimeAsIntegers = testEmployees.map(e => e.fulltime ? 1 : 0)
        const minimumFulltime = Math.min(...fulltimeAsIntegers) === 1
        const maximumFulltime = Math.max(...fulltimeAsIntegers) === 1

        const expected = {
            minimumFulltime,
            maximumFulltime
        }

        return actual.should.eventually.eql(expected)
    }

    testGroupAggregation() {
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
            .sort(([firstKey, firstGroup], [secondKey, secondGroup]) => firstKey - secondKey)
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

        const query = this.employees
            .groupBy(e => ({department: e.departmentId}))
            .sortBy(k => k.department)
            .aggregate((key, g, count) => ({
                department: key.department,
                count: count(),
                maximum: g.salary.max(),
                minimum: g.salary.min(),
                sum: g.salary.sum(),
                average: g.salary.avg()
            }))

        const actual = this.context.run(query)

        return actual.should.eventually.eql(expected)
    }

}