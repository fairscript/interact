import {employees, testEmployees} from '../test_tables'
import {DatabaseContext} from '../../databases/database_context'

export function testBooleanEvaluationFilteringIntegration(context: DatabaseContext) {
    it('a boolean column', () => {
        return context.run(employees.filter(e => e.fulltime).select())
            .should.eventually.eql(testEmployees.filter(e => e.fulltime))
    })

    describe('a boolean literal:', () => {
        it('true', () => {
            return context.run(employees.filter(() => true).select())
                .should.eventually.eql(testEmployees.filter(() => true))
        })

        it('true', () => {
            return context.run(employees.filter(() => false).select())
                .should.eventually.eql(testEmployees.filter(() => false))
        })
    })

    describe('a user-provided boolean value:', () => {
        it('true', () => {
            const provided = true
            return context.run(employees.filter(provided, (p, e) => p).select())
                .should.eventually.eql(testEmployees.filter(() => provided))
        })

        it('false', () => {
            const provided = false
            return context.run(employees.filter(provided, (p, e) => p).select())
                .should.eventually.eql(testEmployees.filter(() => provided))
        })
    })
}

export function testComparisonFilteringIntegration(context: DatabaseContext) {
    describe('with a literal', () => {
        it('equal', () => {
            return context.run(employees.filter(e => e.departmentId === 1).select())
                .should.eventually.eql(testEmployees.filter(e => e.departmentId === 1))
        })

        it('not equal', () => {
            return context.run(employees.filter(e => e.departmentId !== 1).select())
                .should.eventually.eql(testEmployees.filter(e => e.departmentId !== 1))
        })

        it('greater than', () => {
            return context.run(employees.filter(e => e.salary > 6000).select())
                .should.eventually.eql(testEmployees.filter(e => e.salary > 6000))
        })

        it('greater than or equal to', () => {
            return context.run(employees.filter(e => e.salary >= 6000).select())
                .should.eventually.eql(testEmployees.filter(e => e.salary >= 6000))
        })

        it('less than', () => {
            return context.run(employees.filter(e => e.salary < 6000).select())
                .should.eventually.eql(testEmployees.filter(e => e.salary < 6000))
        })

        it('less than or equal to', () => {
            return context.run(employees.filter(e => e.salary <= 6000).select())
                .should.eventually.eql(testEmployees.filter(e => e.salary <= 6000))
        })
    })

    it('with a user-provided value', () => {
        return context.run(employees.filter(1, (p, e) => e.departmentId === p).select())
            .should.eventually.eql(testEmployees.filter(e => e.departmentId === 1))
    })
}

export function testNegationFilteringIntegration(context: DatabaseContext) {
    describe('the evaluation of', () => {
        it('a boolean column', () => {
            return context.run(employees.filter(e => !e.fulltime).select())
                .should.eventually.eql(testEmployees.filter(e => !e.fulltime))
        })

        describe('a boolean literal:', () => {
            it('true', () => {
                return context.run(employees.filter(() => !true).select())
                    .should.eventually.eql(testEmployees.filter(() => !true))
            })

            it('true', () => {
                return context.run(employees.filter(() => !false).select())
                    .should.eventually.eql(testEmployees.filter(() => !false))
            })
        })

        describe('a user-provided boolean value:', () => {
            it('true', () => {
                const provided = true
                return context.run(employees.filter(provided, (p, e) => !p).select())
                    .should.eventually.eql(testEmployees.filter(() => !provided))
            })

            it('false', () => {
                const provided = false
                return context.run(employees.filter(provided, (p, e) => !p).select())
                    .should.eventually.eql(testEmployees.filter(() => !provided))
            })
        })
    })

    describe('an expression inside parentheses:', () => {
        it('comparison', () => {
            return context.run(employees.filter(e => !(e.id === 1)).select())
                .should.eventually.eql(testEmployees.filter(e => !(e.id === 1)))
        })

        it('concatenation', () => {
            return context.run(employees.filter(e => !(e.firstName === 'John' && e.lastName === 'Doe')).select())
                .should.eventually.eql(testEmployees.filter(e => !(e.firstName === 'John' && e.lastName === 'Doe')))
        })
    })
}

export function testConcatenationFilteringIntegration(context: DatabaseContext) {
    describe('with literals', () => {
        it('conjunction', () => {
            return context.run(employees.filter(e => e.firstName === 'John' && e.lastName === 'Doe').single())
                .should.eventually.eql(testEmployees.filter(e => e.firstName === 'John' && e.lastName === 'Doe')[0])
        })

        it('disjunction', () => {
            return context.run(employees.filter(e => e.firstName === 'John' || e.firstName === 'Jane').select())
                .should.eventually.eql(testEmployees.filter(e => e.firstName === 'John' || e.firstName === 'Jane'))
        })

        it('disjunction of conjunctions', () => {
            return context.run(employees.filter(e => (e.firstName === 'John' && e.lastName === 'Doe') || (e.firstName === 'Jane' && e.lastName === 'Poe')).select())
                .should.eventually.eql(testEmployees.filter(e => (e.firstName === 'John' && e.lastName === 'Doe') || (e.firstName === 'Jane' && e.lastName === 'Poe')))
        })

        it('conjunction of disjunctions', () => {
            return context.run(employees.filter(e => (e.firstName === 'John' || e.firstName === 'Jane') && (e.lastName === 'Doe' || e.lastName === 'Poe')).select())
                .should.eventually.eql(testEmployees.filter(e => (e.firstName === 'John' || e.firstName === 'Jane') && (e.lastName === 'Doe' || e.lastName === 'Poe')))
        })
    })

    it('with user-provided values', () => {
        const userProvided = {
            firstName: 'John',
            lastName: 'Doe'
        }
        return context.run(employees.filter(userProvided, (p, e) => e.firstName === p.firstName && e.lastName === p.lastName).single())
            .should.eventually.eql(testEmployees.filter(e => e.firstName === userProvided.firstName && e.lastName === userProvided.lastName)[0])
    })
}