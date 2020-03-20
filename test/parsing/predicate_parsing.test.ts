import * as assert from 'assert'
import {createConstant, createGetFromParameter} from '../../lib/column_operations'
import {Department, Employee} from '../test_tables'
import {
    parsePredicate,
    PredicateExpression
} from '../../lib/parsing/predicate_parsing'
import {
    createEquality,
    createGreaterThan,
    createGreaterThanOrEqualTo,
    createLessThan,
    createLessThanOrEqualTo
} from '../../lib/parsing/predicate/comparison'
import {createAnd, createConcatenation, createOr} from '../../lib/parsing/predicate/concatenation'
import {createInsideParentheses} from '../../lib/parsing/predicate/inside_parentheses'


describe('parsePredicate', () => {
    const idEqualsOne = createEquality(createGetFromParameter('e', 'id'), createConstant(1))
    const oneEqualsId = createEquality(createConstant(1), createGetFromParameter('e', 'id'))
    const titleEqualsCeo = createEquality(createGetFromParameter('e', 'title'), createConstant('CEO'))
    const firstNameEqualsJohn = createEquality(createGetFromParameter('e', 'firstName'), createConstant('John'))
    const lastNameEqualsDoe = createEquality(createGetFromParameter('e', 'lastName'), createConstant('Doe'))
    const firstNameEqualsRichard = createEquality(createGetFromParameter('e', 'firstName'), createConstant('Richard'))
    const lastNameEqualsRoe = createEquality(createGetFromParameter('e', 'lastName'), createConstant('Roe'))

    function parsePredicateWithEmployeeParameter(f: (e: Employee) => boolean): PredicateExpression {
        return parsePredicate(f)
    }

    function parsePredicateWithEmployeeAndDepartmentParameters(f: (e: Employee, d: Department) => boolean): PredicateExpression {
        return parsePredicate(f)
    }

    describe('can parse comparisons', () => {
        describe('with inequalities', () => {
            const getSalary = createGetFromParameter('e', 'salary')
            const fiveThousand = createConstant(5_000)

            it('greater than', () => {
                assert.deepEqual(
                    parsePredicateWithEmployeeParameter(e => e.salary > 5000),
                    createGreaterThan(getSalary, fiveThousand))
            })

            it('greater than or equal to', () => {
                assert.deepEqual(
                    parsePredicateWithEmployeeParameter(e => e.salary >= 5000),
                    createGreaterThanOrEqualTo(getSalary, fiveThousand))
            })

            it('less than', () => {
                assert.deepEqual(
                    parsePredicateWithEmployeeParameter(e => e.salary < 5000),
                    createLessThan(getSalary, fiveThousand))
            })

            it('less than or equal to', () => {
                assert.deepEqual(
                    parsePredicateWithEmployeeParameter(e => e.salary <= 5000),
                    createLessThanOrEqualTo(getSalary, fiveThousand))
            })
        })

        describe('with a double equality sign', () => {
            describe('with an integer', () => {
                it('on the right side', () => {
                    assert.deepEqual(
                        parsePredicateWithEmployeeParameter(e => e.id === 1),
                        idEqualsOne)
                })

                it('on the left side', () => {
                    assert.deepEqual(
                        parsePredicateWithEmployeeParameter(e => 1 === e.id),
                        oneEqualsId)
                })
            })

            describe('with a string', () => {
                describe('surrounded by', () => {
                    it('single quotes', () => {
                        assert.deepEqual(
                            parsePredicateWithEmployeeParameter(e => e.title === 'some title'),
                            createEquality(createGetFromParameter('e', 'title'), createConstant('some title')))
                    })

                    it('double quotes', () => {
                        assert.deepEqual(
                            parsePredicateWithEmployeeParameter(e => e.title === "some title"),
                            createEquality(createGetFromParameter('e', 'title'), createConstant('some title')))
                    })
                })

                describe('containing', () => {
                    it('parentheses', () => {
                        assert.deepEqual(
                            parsePredicateWithEmployeeParameter(e => e.title === '(text in parentheses)'),
                            createEquality(createGetFromParameter('e', 'title'), createConstant('(text in parentheses)')))
                    })

                    it('double parentheses', () => {
                        assert.deepEqual(
                            parsePredicateWithEmployeeParameter(e => e.title === '((text in parentheses))'),
                            createEquality(createGetFromParameter('e', 'title'), createConstant('((text in parentheses))')))
                    })

                    it('escaped single quotes', () => {
                        assert.deepEqual(
                            parsePredicateWithEmployeeParameter(e => e.title === 'I\'m'),
                            createEquality(createGetFromParameter('e', 'title'), createConstant("I\\'m")))
                    })
                })

            })
        })

        describe('with a triple equality sign', () => {
            it('with an integer', () => {
                assert.deepEqual(
                    parsePredicateWithEmployeeParameter(e => e.id === 1),
                    idEqualsOne)
            })

            it('with a string', () => {
                assert.deepEqual(
                    parsePredicateWithEmployeeParameter(e => e.title === 'some title'),
                    createEquality(createGetFromParameter('e', 'title'), createConstant('some title')))
            })
        })
    })

    describe('can parse comparisons inside parentheses', () => {
        it('with an integer', () => {
            assert.deepEqual(
                parsePredicateWithEmployeeParameter(e => (e.id === 1)),
                createInsideParentheses(idEqualsOne))
        })

        it('with a string', () => {
            assert.deepEqual(
                parsePredicateWithEmployeeParameter(e => (e.title == 'some title')),
                createInsideParentheses(createEquality(createGetFromParameter('e', 'title'), createConstant('some title'))))
        })
    })

    describe('can parse comparisons inside parentheses inside parentheses', () => {
        it('with an integer', () => {
            assert.deepEqual(
                parsePredicateWithEmployeeParameter(e => ((e.id == 1))),
                createInsideParentheses(createInsideParentheses(idEqualsOne)))
        })

        it('with a string', () => {
            assert.deepEqual(
                parsePredicateWithEmployeeParameter(e => ((e.title == 'some title'))),
                createInsideParentheses(createInsideParentheses(createEquality(createGetFromParameter('e', 'title'), createConstant('some title')))))
        })
    })

    describe('can parse a conjunction', () => {

        describe('of two literals', () => {
            it('without parentheses', () => {
                assert.deepEqual(
                    parsePredicateWithEmployeeParameter(e => e.firstName == 'John' && e.lastName == 'Doe'),
                    createConcatenation(
                        firstNameEqualsJohn,
                        [
                            createAnd(lastNameEqualsDoe)
                        ]
                    ))
            })

            it('with parentheses around the conjunction', () => {
                assert.deepEqual(
                    parsePredicateWithEmployeeParameter(e => (e.firstName == 'John' && e.lastName == 'Doe')),
                    createInsideParentheses(
                        createConcatenation(
                            firstNameEqualsJohn,
                            [
                                createAnd(lastNameEqualsDoe)
                            ]
                        )
                    )
                )
            })

            it('with parentheses around each literal', () => {
                assert.deepEqual(
                    parsePredicateWithEmployeeParameter(e => (e.firstName == 'John') && (e.lastName == 'Doe')),
                    createConcatenation(
                        createInsideParentheses(
                            firstNameEqualsJohn
                        ),
                        [
                            createAnd(
                                createInsideParentheses(lastNameEqualsDoe)
                            )
                        ]
                    ))
            })

            it('with parentheses around the first of the two literals', () => {
                assert.deepEqual(
                    parsePredicateWithEmployeeParameter(e => (e.firstName == 'John') && e.lastName == 'Doe'),
                    createConcatenation(
                        createInsideParentheses(
                            firstNameEqualsJohn
                        ),
                        [
                            createAnd(
                                lastNameEqualsDoe
                            )
                        ]
                    ))
            })

            it('with parentheses around the second of the two literals', () => {
                assert.deepEqual(
                    parsePredicateWithEmployeeParameter(e => e.firstName == 'John' && (e.lastName == 'Doe')),
                    createConcatenation(
                        firstNameEqualsJohn,
                        [
                            createAnd(
                                createInsideParentheses(
                                    lastNameEqualsDoe
                                )
                            )
                        ]
                    )
                )
            })
        })

        describe('of three literals', () => {
            it('with no parentheses', () => {
                assert.deepEqual(
                    parsePredicateWithEmployeeParameter(e => e.title == 'CEO' && e.firstName == 'John' && e.lastName == 'Doe'),
                    createConcatenation(
                        titleEqualsCeo,
                        [
                            createAnd(firstNameEqualsJohn),
                            createAnd(lastNameEqualsDoe)
                        ]
                    ))
            })

            it('with parentheses around the conjunction', () => {
                assert.deepEqual(
                    parsePredicateWithEmployeeParameter(e => (e.title == 'CEO' && e.firstName == 'John' && e.lastName == 'Doe')),
                    createInsideParentheses(
                        createConcatenation(
                            titleEqualsCeo,
                            [
                                createAnd(firstNameEqualsJohn),
                                createAnd(lastNameEqualsDoe)
                            ]
                        )
                    )
                )
            })

            it('with parentheses around each literal', () => {
                assert.deepEqual(
                    parsePredicateWithEmployeeParameter(e => (e.title == 'CEO') && (e.firstName == 'John') && (e.lastName == 'Doe')),
                    createConcatenation(
                        createInsideParentheses(
                            titleEqualsCeo
                        ),
                        [
                            createAnd(
                                createInsideParentheses(firstNameEqualsJohn)
                            ),
                            createAnd(
                                createInsideParentheses(lastNameEqualsDoe)
                            )
                        ]
                    )
                )
            })

            it('with parentheses around the first literal', () => {
                assert.deepEqual(
                    parsePredicateWithEmployeeParameter(e => (e.title == 'CEO') && e.firstName == 'John' && e.lastName == 'Doe'),
                    createConcatenation(
                        createInsideParentheses(
                            titleEqualsCeo
                        ),
                        [
                            createAnd(firstNameEqualsJohn),
                            createAnd(lastNameEqualsDoe)
                        ]
                    ))
            })

            it('with parentheses around the second literal', () => {
                assert.deepEqual(
                    parsePredicateWithEmployeeParameter(e => e.title == 'CEO' && (e.firstName == 'John') && e.lastName == 'Doe'),
                    createConcatenation(
                        titleEqualsCeo,
                        [
                            createAnd(
                                createInsideParentheses(firstNameEqualsJohn)
                            ),
                            createAnd(lastNameEqualsDoe)
                        ]
                    )
                )
            })

            it('with parentheses around the first two literals', () => {
                assert.deepEqual(
                    parsePredicateWithEmployeeParameter(e => (e.title == 'CEO' && e.firstName == 'John') && e.lastName == 'Doe'),
                    createConcatenation(
                        createInsideParentheses(
                            createConcatenation(
                                titleEqualsCeo,
                                [
                                    createAnd(firstNameEqualsJohn)
                                ]
                            )
                        ),
                        [
                            createAnd(lastNameEqualsDoe)
                        ]
                    )
                )
            })

            it('with parentheses around the last two literals', () => {
                assert.deepEqual(
                    parsePredicateWithEmployeeParameter(e => e.title == 'CEO' && (e.firstName == 'John' && e.lastName == 'Doe')),
                    createConcatenation(
                        titleEqualsCeo,
                        [
                            createAnd(
                                createInsideParentheses(
                                    createConcatenation(
                                        firstNameEqualsJohn,
                                        [
                                            createAnd(lastNameEqualsDoe)
                                        ]
                                    )
                                )
                            )
                        ]
                    )
                )
            })
        })

        it('of two disjunctions', () => {
            assert.deepEqual(
                parsePredicateWithEmployeeParameter(e => (e.firstName == 'John' || e.firstName == 'Richard') && (e.lastName == 'Doe' || e.lastName == 'Roe')),
                createConcatenation(
                    createInsideParentheses(
                        createConcatenation(
                            firstNameEqualsJohn,
                            [
                                createOr(firstNameEqualsRichard)
                            ],
                        )
                    ),
                    [
                        createAnd(
                            createInsideParentheses(
                                createConcatenation(
                                    lastNameEqualsDoe,
                                    [
                                        createOr(lastNameEqualsRoe)
                                    ]
                                )
                            )
                        )
                    ]
                )
            )
        })
    })

    describe('can parse a disjunction', () => {

        it('of two literals', () => {
            assert.deepEqual(
                parsePredicateWithEmployeeParameter(e => e.firstName == 'Jim' || e.firstName == 'James'),
                createConcatenation(
                    createEquality(createGetFromParameter('e', 'firstName'), createConstant('Jim')),
                    [
                        createOr(
                            createEquality(createGetFromParameter('e', 'firstName'), createConstant('James'))
                        )
                    ]
                )
            )
        })

        it('of two conjunctions', () => {
            assert.deepEqual(
                parsePredicateWithEmployeeParameter(e => e.firstName == 'John' && e.lastName == 'Doe' || e.firstName == 'Richard' && e.lastName == 'Roe'),
                createConcatenation(
                    firstNameEqualsJohn,
                    [
                        createAnd(lastNameEqualsDoe),
                        createOr(firstNameEqualsRichard),
                        createAnd(lastNameEqualsRoe)
                    ]
                )
            )
        })

    })

    describe('can parse predicates in a join of two tables', () => {

        it('when the comparison refers to the first table', () => {
            assert.deepEqual(
                parsePredicateWithEmployeeAndDepartmentParameters((e, d) => e.lastName == 'Doe'),
                createEquality(createGetFromParameter('e', 'lastName'), createConstant('Doe'))
            )
        })

        it('when the comparison refers to the second table', () => {
            assert.deepEqual(
                parsePredicateWithEmployeeAndDepartmentParameters((e, d) => d.id == 1),
                createEquality(createGetFromParameter('d', 'id'), createConstant(1))
            )
        })

        it('when comparisons refer to both tables', () => {
            assert.deepEqual(
                parsePredicateWithEmployeeAndDepartmentParameters((e, d) => e.lastName == 'Doe' && d.id == 1),
                createConcatenation(
                    createEquality(createGetFromParameter('e', 'lastName'), createConstant('Doe')),
                    [
                        createAnd(
                            createEquality(createGetFromParameter('d', 'id'), createConstant(1)))
                    ])
            )
        })

        it('when comparisons refer to both tables in reverse order', () => {
            assert.deepEqual(
                parsePredicateWithEmployeeAndDepartmentParameters((e, d) => d.id == 1 && e.lastName == 'Doe'),
                createConcatenation(
                    createEquality(createGetFromParameter('d', 'id'), createConstant(1)),
                    [
                        createAnd(
                            createEquality(createGetFromParameter('e', 'lastName'), createConstant('Doe')))
                    ])
            )
        })
    })
})