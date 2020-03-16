import {
    createAnd,
    createConcatenation, createEquality, createGreaterThan, createGreaterThanOrEqualTo,
    createInsideParentheses, createLessThan, createLessThanOrEqualTo, createOr,
    parsePredicate
} from '../../lib/parsing/predicate_parsing'
import * as assert from 'assert'
import {createConstant, createGet} from '../../lib/column_operations'


describe('parsePredicate', () => {
    const idEqualsOne = createEquality(createGet(1, 'id'), createConstant(1))
    const idEqualsOneInReverseOrder = createEquality(createConstant(1), createGet(1, 'id'))
    const titleEqualsCeo = createEquality(createGet(1, 'title'), createConstant('CEO'))
    const firstNameEqualsJohn = createEquality(createGet(1, 'firstName'), createConstant('John'))
    const lastNameEqualsDoe = createEquality(createGet(1, 'lastName'), createConstant('Doe'))
    const firstNameEqualsRichard = createEquality(createGet(1, 'firstName'), createConstant('Richard'))
    const lastNameEqualsRoe = createEquality(createGet(1, 'lastName'), createConstant('Roe'))

    describe('can parse comparisons', () => {
        describe('with inequalities', () => {
            const getSalary = createGet(1, 'salary')
            const fiveThousand = createConstant(5_000)

            it('greater than', () => {
                assert.deepEqual(
                    parsePredicate(e => e.salary > 5000),
                    createGreaterThan(getSalary, fiveThousand))
            })

            it('greater than or equal to', () => {
                assert.deepEqual(
                    parsePredicate(e => e.salary >= 5000),
                    createGreaterThanOrEqualTo(getSalary, fiveThousand))
            })

            it('less than', () => {
                assert.deepEqual(
                    parsePredicate(e => e.salary < 5000),
                    createLessThan(getSalary, fiveThousand))
            })

            it('less than or equal to', () => {
                assert.deepEqual(
                    parsePredicate(e => e.salary <= 5000),
                    createLessThanOrEqualTo(getSalary, fiveThousand))
            })
        })

        describe('with a double equality sign', () => {
            describe('with an integer', () => {
                it('on the right side', () => {
                    assert.deepEqual(
                        parsePredicate(e => e.id == 1),
                        idEqualsOne)
                })

                it('on the left side', () => {
                    assert.deepEqual(
                        parsePredicate(e => 1 == e.id),
                        idEqualsOneInReverseOrder)
                })
            })

            describe('with a string', () => {
                describe('surrounded by', () => {
                    it('single quotes', () => {
                        assert.deepEqual(
                            parsePredicate(e => e.title == 'some title'),
                            createEquality(createGet(1, 'title'), createConstant('some title')))
                    })

                    it('double quotes', () => {
                        assert.deepEqual(
                            parsePredicate(e => e.title == "some title"),
                            createEquality(createGet(1, 'title'), createConstant('some title')))
                    })
                })

                describe('containing', () => {
                    it('parentheses', () => {
                        assert.deepEqual(
                            parsePredicate(e => e.title == '(text in parentheses)'),
                            createEquality(createGet(1, 'title'), createConstant('(text in parentheses)')))
                    })

                    it('double parentheses', () => {
                        assert.deepEqual(
                            parsePredicate(e => e.title == '((text in parentheses))'),
                            createEquality(createGet(1, 'title'), createConstant('((text in parentheses))')))
                    })

                    it('escaped single quotes', () => {
                        assert.deepEqual(
                            parsePredicate(e => e.title == 'I\'m'),
                            createEquality(createGet(1, 'title'), createConstant("I\\'m")))
                    })
                })

            })
        })
        describe('with a triple equality sign', () => {
            it('with an integer', () => {
                assert.deepEqual(
                    parsePredicate(e => e.id === 1),
                    idEqualsOne)
            })

            it('with a string', () => {
                assert.deepEqual(
                    parsePredicate(e => e.title === 'some title'),
                    createEquality(createGet(1, 'title'), createConstant('some title')))
            })
        })
    })

    describe('can parse comparisons inside parentheses', () => {
        it('with an integer', () => {
            assert.deepEqual(
                parsePredicate(e => (e.id === 1)),
                createInsideParentheses(idEqualsOne))
        })

        it('with a string', () => {
            assert.deepEqual(
                parsePredicate(e => (e.title == 'some title')),
                createInsideParentheses(createEquality(createGet(1, 'title'), createConstant('some title'))))
        })
    })

    describe('can parse comparisons inside parentheses inside parentheses', () => {
        it('with an integer', () => {
            assert.deepEqual(
                parsePredicate(e => ((e.id == 1))),
                createInsideParentheses(createInsideParentheses(idEqualsOne)))
        })

        it('with a string', () => {
            assert.deepEqual(
                parsePredicate(e => ((e.title == 'some title'))),
                createInsideParentheses(createInsideParentheses(createEquality(createGet(1, 'title'), createConstant('some title')))))
        })
    })

    describe('can parse a conjunction', () => {

        describe('of two literals', () => {
            it('without parentheses', () => {
                assert.deepEqual(
                    parsePredicate(e => e.firstName == 'John' && e.lastName == 'Doe'),
                    createConcatenation(
                        firstNameEqualsJohn,
                        [
                            createAnd(lastNameEqualsDoe)
                        ]
                    ))
            })

            it('with parentheses around the conjunction', () => {
                assert.deepEqual(
                    parsePredicate(e => (e.firstName == 'John' && e.lastName == 'Doe')),
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
                    parsePredicate(e => (e.firstName == 'John') && (e.lastName == 'Doe')),
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
                    parsePredicate(e => (e.firstName == 'John') && e.lastName == 'Doe'),
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
                    parsePredicate(e => e.firstName == 'John' && (e.lastName == 'Doe')),
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
                    parsePredicate(e => e.title == 'CEO' && e.firstName == 'John' && e.lastName == 'Doe'),
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
                    parsePredicate(e => (e.title == 'CEO' && e.firstName == 'John' && e.lastName == 'Doe')),
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
                    parsePredicate(e => (e.title == 'CEO') && (e.firstName == 'John') && (e.lastName == 'Doe')),
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
                    parsePredicate(e => (e.title == 'CEO') && e.firstName == 'John' && e.lastName == 'Doe'),
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
                    parsePredicate(e => e.title == 'CEO' && (e.firstName == 'John') && e.lastName == 'Doe'),
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
                    parsePredicate(e => (e.title == 'CEO' && e.firstName == 'John') && e.lastName == 'Doe'),
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
                    parsePredicate(e => e.title == 'CEO' && (e.firstName == 'John' && e.lastName == 'Doe')),
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
                parsePredicate(e => (e.firstName == 'John' || e.firstName == 'Richard') && (e.lastName == 'Doe' || e.lastName == 'Roe')),
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
                parsePredicate(e => e.firstName == 'Jim' || e.firstName == 'James'),
                createConcatenation(
                    createEquality(createGet(1, 'firstName'), createConstant('Jim')),
                    [
                        createOr(
                            createEquality(createGet(1, 'firstName'), createConstant('James'))
                        )
                    ]
                )
            )
        })

        it('of two conjunctions', () => {
            assert.deepEqual(
                parsePredicate(e => e.firstName == 'John' && e.lastName == 'Doe' || e.firstName == 'Richard' && e.lastName == 'Roe'),
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
                parsePredicate((e, d) => e.lastName == 'Doe'),
                createEquality(createGet(1, 'lastName'), createConstant('Doe'))
            )
        })

        it('when the comparison refers to the second table', () => {
            assert.deepEqual(
                parsePredicate((e, d) => d.id == 1),
                createEquality(createGet(2, 'id'), createConstant(1))
            )
        })

        it('when comparisons refer to both tables', () => {
            assert.deepEqual(
                parsePredicate((e, d) => e.lastName == 'Doe' && d.id == 1),
                createConcatenation(
                    createEquality(createGet(1, 'lastName'), createConstant('Doe')),
                    [
                        createAnd(
                            createEquality(createGet(2, 'id'), createConstant(1)))
                    ])
            )
        })

        it('when comparisons refer to both tables in reverse order', () => {
            assert.deepEqual(
                parsePredicate((e, d) => d.id == 1 && e.lastName == 'Doe'),
                createConcatenation(
                    createEquality(createGet(2, 'id'), createConstant(1)),
                    [
                        createAnd(
                            createEquality(createGet(1, 'lastName'), createConstant('Doe')))
                    ])
            )
        })
    })
})