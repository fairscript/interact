import {departments, Employee, employees} from '../test_tables'
import {
    createAnd,
    createConcatenation, createEquality,
    createInsideParentheses, createOr,
    parsePredicate
} from '../../lib/parsing/predicate_parsing'
import * as assert from 'assert'
import {createGet} from '../../lib/column_operations'


describe('parsePredicate', () => {
    const idEqualsOne = createEquality(createGet(1, 'id'), 1)
    const titleEqualsCeo = createEquality(createGet(1, 'title'), 'CEO')
    const firstNameEqualsJohn = createEquality(createGet(1, 'firstName'), 'John')
    const lastNameEqualsDoe = createEquality(createGet(1, 'lastName'), 'Doe')
    const firstNameEqualsRichard = createEquality(createGet(1, 'firstName'), 'Richard')
    const lastNameEqualsRoe = createEquality(createGet(1, 'lastName'), 'Roe')

    describe('can parse comparisons', () => {
        describe('with a double equality sign', () => {
            it('with an integer', () => {
                assert.deepEqual(
                    parsePredicate(e => e.id == 1),
                    idEqualsOne)
            })

            describe('with a string', () => {
                describe('surrounded by', () => {
                    it('single quotes', () => {
                        assert.deepEqual(
                            parsePredicate(e => e.title == 'some title'),
                            createEquality(createGet(1, 'title'), 'some title'))
                    })

                    it('double quotes', () => {
                        assert.deepEqual(
                            parsePredicate(e => e.title == "some title"),
                            createEquality(createGet(1, 'title'), 'some title'))
                    })
                })

                describe('containing', () => {
                    it('parentheses', () => {
                        assert.deepEqual(
                            parsePredicate(e => e.title == '(text in parentheses)'),
                            createEquality(createGet(1, 'title'), '(text in parentheses)'))
                    })

                    it('double parentheses', () => {
                        assert.deepEqual(
                            parsePredicate(e => e.title == '((text in parentheses))'),
                            createEquality(createGet(1, 'title'), '((text in parentheses))'))
                    })

                    it('escaped single quotes', () => {
                        assert.deepEqual(
                            parsePredicate(e => e.title == 'I\'m'),
                            createEquality(createGet(1, 'title'), "I\\'m"))
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
                    createEquality(createGet(1, 'title'), 'some title'))
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
                createInsideParentheses(createEquality(createGet(1, 'title'), 'some title')))
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
                createInsideParentheses(createInsideParentheses(createEquality(createGet(1, 'title'), 'some title'))))
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
                    createEquality(createGet(1, 'firstName'), 'Jim'),
                    [
                        createOr(
                            createEquality(createGet(1, 'firstName'), 'James')
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
                createEquality(createGet(1, 'lastName'), 'Doe')
            )
        })

        it('when the comparison refers to the second table', () => {
            assert.deepEqual(
                parsePredicate((e, d) => d.id == 1),
                createEquality(createGet(2, 'id'), 1)
            )
        })

        it('when comparisons refer to both tables', () => {
            assert.deepEqual(
                parsePredicate((e, d) => e.lastName == 'Doe' && d.id == 1),
                createConcatenation(
                    createEquality(createGet(1, 'lastName'), 'Doe'),
                    [
                        createAnd(
                            createEquality(createGet(2, 'id'), 1))
                    ])
            )
        })

        it('when comparisons refer to both tables in reverse order', () => {
            assert.deepEqual(
                parsePredicate((e, d) => d.id == 1 && e.lastName == 'Doe'),
                createConcatenation(
                    createEquality(createGet(2, 'id'), 1),
                    [
                        createAnd(
                            createEquality(createGet(1, 'lastName'), 'Doe'))
                    ])
            )
        })
    })
})