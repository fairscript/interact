import * as assert from 'assert'
import {createConstant, createGetColumn} from '../../lib/column_operations'
import {Department, Employee} from '../test_tables'
import {
    createEquality,
    createGreaterThan,
    createGreaterThanOrEqualTo,
    createLessThan,
    createLessThanOrEqualTo
} from '../../lib/parsing/predicate/comparison'
import {createAnd, createConcatenation, createOr} from '../../lib/parsing/predicate/concatenation'
import {createInsideParentheses} from '../../lib/parsing/predicate/inside_parentheses'
import {extractLambdaParametersAndExpression} from '../../lib/parsing/javascript/lambda_parsing'
import {PredicateExpression} from '../../lib/parsing/filter_parsing'
import {parseParameterlessPredicate} from '../../lib/parsing/filtering/parameterless_filter_parsing'


describe('parseFilter', () => {
    const idEqualsOne = createEquality(createGetColumn('e', 'id'), createConstant(1))
    const oneEqualsId = createEquality(createConstant(1), createGetColumn('e', 'id'))
    const titleEqualsCeo = createEquality(createGetColumn('e', 'title'), createConstant('CEO'))
    const firstNameEqualsJohn = createEquality(createGetColumn('e', 'firstName'), createConstant('John'))
    const lastNameEqualsDoe = createEquality(createGetColumn('e', 'lastName'), createConstant('Doe'))
    const firstNameEqualsRichard = createEquality(createGetColumn('e', 'firstName'), createConstant('Richard'))
    const lastNameEqualsRoe = createEquality(createGetColumn('e', 'lastName'), createConstant('Roe'))

    function parseFilter(f: Function): PredicateExpression {
        const { parameters, expression } = extractLambdaParametersAndExpression(f)

        return parseParameterlessPredicate(parameters ,expression)
    }

    function parseFilterWithEmployeeParameter(f: (e: Employee) => boolean): PredicateExpression {
        return parseFilter(f)
    }

    function parseFilterWithEmployeeAndDepartmentParameters(f: (e: Employee, d: Department) => boolean): PredicateExpression {
        return parseFilter(f)
    }

    describe('can parse comparisons', () => {
        describe('with inequalities', () => {
            const getSalary = createGetColumn('e', 'salary')
            const fiveThousand = createConstant(5_000)

            it('greater than', () => {
                assert.deepEqual(
                    parseFilterWithEmployeeParameter(e => e.salary > 5000),
                    createGreaterThan(getSalary, fiveThousand))
            })

            it('greater than or equal to', () => {
                assert.deepEqual(
                    parseFilterWithEmployeeParameter(e => e.salary >= 5000),
                    createGreaterThanOrEqualTo(getSalary, fiveThousand))
            })

            it('less than', () => {
                assert.deepEqual(
                    parseFilterWithEmployeeParameter(e => e.salary < 5000),
                    createLessThan(getSalary, fiveThousand))
            })

            it('less than or equal to', () => {
                assert.deepEqual(
                    parseFilterWithEmployeeParameter(e => e.salary <= 5000),
                    createLessThanOrEqualTo(getSalary, fiveThousand))
            })
        })

        describe('with a double equality sign', () => {
            describe('with an integer', () => {
                it('on the right side', () => {
                    assert.deepEqual(
                        parseFilterWithEmployeeParameter(e => e.id === 1),
                        idEqualsOne)
                })

                it('on the left side', () => {
                    assert.deepEqual(
                        parseFilterWithEmployeeParameter(e => 1 === e.id),
                        oneEqualsId)
                })
            })

            describe('with a string', () => {
                describe('surrounded by', () => {
                    it('single quotes', () => {
                        assert.deepEqual(
                            parseFilterWithEmployeeParameter(e => e.title === 'some title'),
                            createEquality(createGetColumn('e', 'title'), createConstant('some title')))
                    })

                    it('double quotes', () => {
                        assert.deepEqual(
                            parseFilterWithEmployeeParameter(e => e.title === "some title"),
                            createEquality(createGetColumn('e', 'title'), createConstant('some title')))
                    })
                })

                describe('containing', () => {
                    it('parentheses', () => {
                        assert.deepEqual(
                            parseFilterWithEmployeeParameter(e => e.title === '(text in parentheses)'),
                            createEquality(createGetColumn('e', 'title'), createConstant('(text in parentheses)')))
                    })

                    it('double parentheses', () => {
                        assert.deepEqual(
                            parseFilterWithEmployeeParameter(e => e.title === '((text in parentheses))'),
                            createEquality(createGetColumn('e', 'title'), createConstant('((text in parentheses))')))
                    })

                    it('escaped single quotes', () => {
                        assert.deepEqual(
                            parseFilterWithEmployeeParameter(e => e.title === 'I\'m'),
                            createEquality(createGetColumn('e', 'title'), createConstant("I\\'m")))
                    })
                })

            })
        })

        describe('with a triple equality sign', () => {
            it('with an integer', () => {
                assert.deepEqual(
                    parseFilterWithEmployeeParameter(e => e.id === 1),
                    idEqualsOne)
            })

            it('with a string', () => {
                assert.deepEqual(
                    parseFilterWithEmployeeParameter(e => e.title === 'some title'),
                    createEquality(createGetColumn('e', 'title'), createConstant('some title')))
            })
        })
    })

    describe('can parse comparisons inside parentheses', () => {
        it('with an integer', () => {
            assert.deepEqual(
                parseFilterWithEmployeeParameter(e => (e.id === 1)),
                createInsideParentheses(idEqualsOne))
        })

        it('with a string', () => {
            assert.deepEqual(
                parseFilterWithEmployeeParameter(e => (e.title == 'some title')),
                createInsideParentheses(createEquality(createGetColumn('e', 'title'), createConstant('some title'))))
        })
    })

    describe('can parse comparisons inside parentheses inside parentheses', () => {
        it('with an integer', () => {
            assert.deepEqual(
                parseFilterWithEmployeeParameter(e => ((e.id == 1))),
                createInsideParentheses(createInsideParentheses(idEqualsOne)))
        })

        it('with a string', () => {
            assert.deepEqual(
                parseFilterWithEmployeeParameter(e => ((e.title == 'some title'))),
                createInsideParentheses(createInsideParentheses(createEquality(createGetColumn('e', 'title'), createConstant('some title')))))
        })
    })

    describe('can parse a conjunction', () => {

        describe('of two literals', () => {
            it('without parentheses', () => {
                assert.deepEqual(
                    parseFilterWithEmployeeParameter(e => e.firstName == 'John' && e.lastName == 'Doe'),
                    createConcatenation(
                        firstNameEqualsJohn,
                        [
                            createAnd(lastNameEqualsDoe)
                        ]
                    ))
            })

            it('with parentheses around the conjunction', () => {
                assert.deepEqual(
                    parseFilterWithEmployeeParameter(e => (e.firstName == 'John' && e.lastName == 'Doe')),
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
                    parseFilterWithEmployeeParameter(e => (e.firstName == 'John') && (e.lastName == 'Doe')),
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
                    parseFilterWithEmployeeParameter(e => (e.firstName == 'John') && e.lastName == 'Doe'),
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
                    parseFilterWithEmployeeParameter(e => e.firstName == 'John' && (e.lastName == 'Doe')),
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
                    parseFilterWithEmployeeParameter(e => e.title == 'CEO' && e.firstName == 'John' && e.lastName == 'Doe'),
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
                    parseFilterWithEmployeeParameter(e => (e.title == 'CEO' && e.firstName == 'John' && e.lastName == 'Doe')),
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
                    parseFilterWithEmployeeParameter(e => (e.title == 'CEO') && (e.firstName == 'John') && (e.lastName == 'Doe')),
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
                    parseFilterWithEmployeeParameter(e => (e.title == 'CEO') && e.firstName == 'John' && e.lastName == 'Doe'),
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
                    parseFilterWithEmployeeParameter(e => e.title == 'CEO' && (e.firstName == 'John') && e.lastName == 'Doe'),
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
                    parseFilterWithEmployeeParameter(e => (e.title == 'CEO' && e.firstName == 'John') && e.lastName == 'Doe'),
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
                    parseFilterWithEmployeeParameter(e => e.title == 'CEO' && (e.firstName == 'John' && e.lastName == 'Doe')),
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
                parseFilterWithEmployeeParameter(e => (e.firstName == 'John' || e.firstName == 'Richard') && (e.lastName == 'Doe' || e.lastName == 'Roe')),
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
                parseFilterWithEmployeeParameter(e => e.firstName == 'Jim' || e.firstName == 'James'),
                createConcatenation(
                    createEquality(createGetColumn('e', 'firstName'), createConstant('Jim')),
                    [
                        createOr(
                            createEquality(createGetColumn('e', 'firstName'), createConstant('James'))
                        )
                    ]
                )
            )
        })

        it('of two conjunctions', () => {
            assert.deepEqual(
                parseFilterWithEmployeeParameter(e => e.firstName == 'John' && e.lastName == 'Doe' || e.firstName == 'Richard' && e.lastName == 'Roe'),
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
                parseFilterWithEmployeeAndDepartmentParameters((e, d) => e.lastName == 'Doe'),
                createEquality(createGetColumn('e', 'lastName'), createConstant('Doe'))
            )
        })

        it('when the comparison refers to the second table', () => {
            assert.deepEqual(
                parseFilterWithEmployeeAndDepartmentParameters((e, d) => d.id == 1),
                createEquality(createGetColumn('d', 'id'), createConstant(1))
            )
        })

        it('when comparisons refer to both tables', () => {
            assert.deepEqual(
                parseFilterWithEmployeeAndDepartmentParameters((e, d) => e.lastName == 'Doe' && d.id == 1),
                createConcatenation(
                    createEquality(createGetColumn('e', 'lastName'), createConstant('Doe')),
                    [
                        createAnd(
                            createEquality(createGetColumn('d', 'id'), createConstant(1)))
                    ])
            )
        })

        it('when comparisons refer to both tables in reverse order', () => {
            assert.deepEqual(
                parseFilterWithEmployeeAndDepartmentParameters((e, d) => d.id == 1 && e.lastName == 'Doe'),
                createConcatenation(
                    createEquality(createGetColumn('d', 'id'), createConstant(1)),
                    [
                        createAnd(
                            createEquality(createGetColumn('e', 'lastName'), createConstant('Doe')))
                    ])
            )
        })
    })
})