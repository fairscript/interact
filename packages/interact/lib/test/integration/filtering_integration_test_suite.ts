import {testEmployees} from '../test_tables'
import {DatabaseContext} from '../../databases/database_context'
import {Table} from '../../queries/one/table'
import {Employee} from '../model/employee'
import {SortTable} from '../../queries/one/sort_table'

export class FilteringIntegrationTestSuite {
    employeesSortedById : SortTable<Employee>

    constructor(private context: DatabaseContext, private employees: Table<Employee>) {
        this.employeesSortedById = employees.sortBy(e => e.id)
    }

    testBooleanEvaluationFiltering() {
        it('a boolean column', () => {
            return this.context.run(this.employeesSortedById.filter(e => e.fulltime).select())
                .should.eventually.eql(testEmployees.filter(e => e.fulltime))
        })

        describe('a boolean literal', () => {
            it('true', () => {
                return this.context.run(this.employeesSortedById.filter(() => true).select())
                    .should.eventually.eql(testEmployees.filter(() => true))
            })

            it('true', () => {
                return this.context.run(this.employeesSortedById.filter(() => false).select())
                    .should.eventually.eql(testEmployees.filter(() => false))
            })
        })

        describe('a user-provided boolean value', () => {
            it('true', () => {
                const provided = true
                return this.context.run(this.employeesSortedById.filter(provided, (p, e) => p).select())
                    .should.eventually.eql(testEmployees.filter(() => provided))
            })

            it('false', () => {
                const provided = false
                return this.context.run(this.employeesSortedById.filter(provided, (p, e) => p).select())
                    .should.eventually.eql(testEmployees.filter(() => provided))
            })
        })
    }

    testComparisonFiltering() {
        describe('with a literal', () => {
            it('equal', () => {
                return this.context.run(this.employeesSortedById.filter(e => e.departmentId === 1).select())
                    .should.eventually.eql(testEmployees.filter(e => e.departmentId === 1))
            })

            it('not equal', () => {
                return this.context.run(this.employeesSortedById.filter(e => e.departmentId !== 1).select())
                    .should.eventually.eql(testEmployees.filter(e => e.departmentId !== 1))
            })

            it('greater than', () => {
                return this.context.run(this.employeesSortedById.filter(e => e.salary > 6000).select())
                    .should.eventually.eql(testEmployees.filter(e => e.salary > 6000))
            })

            it('greater than or equal to', () => {
                return this.context.run(this.employeesSortedById.filter(e => e.salary >= 6000).select())
                    .should.eventually.eql(testEmployees.filter(e => e.salary >= 6000))
            })

            it('less than', () => {
                return this.context.run(this.employeesSortedById.filter(e => e.salary < 6000).select())
                    .should.eventually.eql(testEmployees.filter(e => e.salary < 6000))
            })

            it('less than or equal to', () => {
                return this.context.run(this.employeesSortedById.filter(e => e.salary <= 6000).select())
                    .should.eventually.eql(testEmployees.filter(e => e.salary <= 6000))
            })
        })

        it('with a user-provided value', () => {
            return this.context.run(this.employeesSortedById.filter(1, (p, e) => e.departmentId === p).select())
                .should.eventually.eql(testEmployees.filter(e => e.departmentId === 1))
        })
    }

    testNegationFiltering() {
        describe('the evaluation of', () => {
            it('a boolean column', () => {
                return this.context.run(this.employeesSortedById.filter(e => !e.fulltime).select())
                    .should.eventually.eql(testEmployees.filter(e => !e.fulltime))
            })

            describe('a boolean literal:', () => {
                it('true', () => {
                    return this.context.run(this.employeesSortedById.filter(() => !true).select())
                        .should.eventually.eql(testEmployees.filter(() => !true))
                })

                it('true', () => {
                    return this.context.run(this.employeesSortedById.filter(() => !false).select())
                        .should.eventually.eql(testEmployees.filter(() => !false))
                })
            })

            describe('a user-provided boolean value:', () => {
                it('true', () => {
                    const provided = true
                    return this.context.run(this.employeesSortedById.filter(provided, (p, e) => !p).select())
                        .should.eventually.eql(testEmployees.filter(() => !provided))
                })

                it('false', () => {
                    const provided = false
                    return this.context.run(this.employeesSortedById.filter(provided, (p, e) => !p).select())
                        .should.eventually.eql(testEmployees.filter(() => !provided))
                })
            })
        })

        describe('an expression inside parentheses:', () => {
            it('comparison', () => {
                return this.context.run(this.employeesSortedById.filter(e => !(e.id === 1)).select())
                    .should.eventually.eql(testEmployees.filter(e => !(e.id === 1)))
            })

            it('concatenation', () => {
                return this.context.run(this.employeesSortedById.filter(e => !(e.firstName === 'John' && e.lastName === 'Doe')).select())
                    .should.eventually.eql(testEmployees.filter(e => !(e.firstName === 'John' && e.lastName === 'Doe')))
            })
        })
    }

    testConcatenationFiltering() {
        describe('with literals', () => {
            it('conjunction', () => {
                return this.context.run(this.employees.filter(e => e.firstName === 'John' && e.lastName === 'Doe').single())
                    .should.eventually.eql(testEmployees.filter(e => e.firstName === 'John' && e.lastName === 'Doe')[0])
            })

            it('disjunction', () => {
                return this.context.run(this.employeesSortedById.filter(e => e.firstName === 'John' || e.firstName === 'Jane').select())
                    .should.eventually.eql(testEmployees.filter(e => e.firstName === 'John' || e.firstName === 'Jane'))
            })

            it('disjunction of conjunctions', () => {
                return this.context.run(this.employeesSortedById.filter(e => (e.firstName === 'John' && e.lastName === 'Doe') || (e.firstName === 'Jane' && e.lastName === 'Poe')).select())
                    .should.eventually.eql(testEmployees.filter(e => (e.firstName === 'John' && e.lastName === 'Doe') || (e.firstName === 'Jane' && e.lastName === 'Poe')))
            })

            it('conjunction of disjunctions', () => {
                return this.context.run(this.employeesSortedById.filter(e => (e.firstName === 'John' || e.firstName === 'Jane') && (e.lastName === 'Doe' || e.lastName === 'Poe')).select())
                    .should.eventually.eql(testEmployees.filter(e => (e.firstName === 'John' || e.firstName === 'Jane') && (e.lastName === 'Doe' || e.lastName === 'Poe')))
            })
        })

        it('with user-provided values', () => {
            const userProvided = {
                firstName: 'John',
                lastName: 'Doe'
            }
            return this.context.run(this.employees.filter(userProvided, (p, e) => e.firstName === p.firstName && e.lastName === p.lastName).single())
                .should.eventually.eql(testEmployees.filter(e => e.firstName === userProvided.firstName && e.lastName === userProvided.lastName)[0])
        })
    }
}