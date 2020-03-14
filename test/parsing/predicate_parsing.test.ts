import {Employee} from '../test_tables'
import {
    createAnd,
    createComparison, createConcatenation,
    createInsideParentheses, createOr,
    parsePredicate
} from '../../lib/parsing/predicate_parsing'
import * as assert from 'assert'
import {createGet} from '../../lib/column_operations'

describe('parsePredicate', () => {
    describe('can parse comparisons', () => {
        describe('with a double equality sign', () => {
            it('with an integer', () => {
                assert.deepEqual(
                    parsePredicate<Employee>(e => e.id === 1),
                    createComparison(createGet(1, 'id'), '=', 1))
            })

            describe('with a string', () => {
                describe('surrounded by', () => {
                    it('single quotes', () => {
                        assert.deepEqual(
                            parsePredicate<Employee>(e => e.title == 'some title'),
                            createComparison(createGet(1, 'title'), '=', 'some title'))
                    })

                    it('double quotes', () => {
                        assert.deepEqual(
                            parsePredicate<Employee>(e => e.title == "some title"),
                            createComparison(createGet(1, 'title'), '=', 'some title'))
                    })
                })

                describe('containing', () => {
                    it('parentheses', () => {
                        assert.deepEqual(
                            parsePredicate<Employee>(e => e.title == '(text in parentheses)'),
                            createComparison(createGet(1, 'title'), '=', '(text in parentheses)'))
                    })

                    it('double parentheses', () => {
                        assert.deepEqual(
                            parsePredicate<Employee>(e => e.title == '((text in parentheses))'),
                            createComparison(createGet(1, 'title'), '=', '((text in parentheses))'))
                    })

                    it('escaped single quotes', () => {
                        assert.deepEqual(
                            parsePredicate<Employee>(e => e.title == 'I\'m'),
                            createComparison(createGet(1, 'title'), '=', "I\\'m"))
                    })
                })

            })
        })
        describe('with a triple equality sign', () => {
            it('with an integer', () => {
                assert.deepEqual(
                    parsePredicate<Employee>(e => e.id === 1),
                    createComparison(createGet(1, 'id'), '=', 1))
            })

            it('with a string', () => {
                assert.deepEqual(
                    parsePredicate<Employee>(e => e.title === 'some title'),
                    createComparison(createGet(1, 'title'), '=', 'some title'))
            })
        })
    })

    describe('can parse parentheses containing a comparison', () => {
        it('with an integer', () => {
            assert.deepEqual(
                parsePredicate<Employee>(e => (e.id == 1)),
                createInsideParentheses(createComparison(createGet(1, 'id'), '=', 1)))
        })

        it('with a string', () => {
            assert.deepEqual(
                parsePredicate<Employee>(e => (e.title == 'some title')),
                createInsideParentheses(createComparison(createGet(1, 'title'), '=', 'some title')))
        })
    })

    describe('can parse parentheses inside parentheses containing a comparison', () => {
        it('with an integer', () => {
            assert.deepEqual(
                parsePredicate<Employee>(e => ((e.id == 1))),
                createInsideParentheses(createInsideParentheses(createComparison(createGet(1, 'id'), '=', 1))))
        })

        it('with a string', () => {
            assert.deepEqual(
                parsePredicate<Employee>(e => ((e.title == 'some title'))),
                createInsideParentheses(createInsideParentheses(createComparison(createGet(1, 'title'), '=', 'some title'))))
        })
    })

    describe('can parse a conjunction', () => {

        describe('of two literals', () => {
            it('without parentheses', () => {
                assert.deepEqual(
                    parsePredicate<Employee>(e => e.firstName == 'John' && e.lastName == 'Doe'),
                    createConcatenation(
                        createComparison(createGet(1, 'firstName'), '=', 'John'),
                        [
                            createAnd(
                                createComparison(createGet(1, 'lastName'), '=', 'Doe'))
                        ]
                    ))
            })

            it('with parentheses around the conjunction', () => {
                assert.deepEqual(
                    parsePredicate<Employee>(e => (e.firstName == 'John' && e.lastName == 'Doe')),
                    createInsideParentheses(
                        createConcatenation(
                            createComparison(createGet(1, 'firstName'), '=', 'John'),
                            [
                                createAnd(
                                    createComparison(createGet(1, 'lastName'), '=', 'Doe'))
                            ]
                        )
                    )
                )
            })

            it('with parentheses around each literal', () => {
                assert.deepEqual(
                    parsePredicate<Employee>(e => (e.firstName == 'John') && (e.lastName == 'Doe')),
                    createConcatenation(
                        createInsideParentheses(
                            createComparison(createGet(1, 'firstName'), '=', 'John')
                        ),
                        [
                            createAnd(
                                createInsideParentheses(
                                    createComparison(createGet(1, 'lastName'), '=', 'Doe')
                                )
                            )
                        ]
                    ))
            })

            it('with parentheses around the first of the two literals', () => {
                assert.deepEqual(
                    parsePredicate<Employee>(e => (e.firstName == 'John') && e.lastName == 'Doe'),
                    createConcatenation(
                        createInsideParentheses(
                            createComparison(createGet(1, 'firstName'), '=', 'John')
                        ),
                        [
                            createAnd(
                                createComparison(createGet(1, 'lastName'), '=', 'Doe')
                            )
                        ]
                    ))
            })

            it('with parentheses around the second of the two literals', () => {
                assert.deepEqual(
                    parsePredicate<Employee>(e => e.firstName == 'John' && (e.lastName == 'Doe')),
                    createConcatenation(
                        createComparison(createGet(1, 'firstName'), '=', 'John'),
                        [
                            createAnd(
                                createInsideParentheses(
                                    createComparison(createGet(1, 'lastName'), '=', 'Doe')
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
                    parsePredicate<Employee>(e => e.title == 'CEO' && e.firstName == 'John' && e.lastName == 'Doe'),
                    createConcatenation(
                        createComparison(createGet(1, 'title'), '=', 'CEO'),
                        [
                            createAnd(
                                createComparison(createGet(1, 'firstName'), '=', 'John')
                            ),
                            createAnd(
                                createComparison(createGet(1, 'lastName'), '=', 'Doe')
                            )
                        ]
                    ))
            })

            it('with parentheses around the conjunction', () => {
                assert.deepEqual(
                    parsePredicate<Employee>(e => (e.title == 'CEO' && e.firstName == 'John' && e.lastName == 'Doe')),
                    createInsideParentheses(
                        createConcatenation(
                            createComparison(createGet(1, 'title'), '=', 'CEO'),
                            [
                                createAnd(
                                    createComparison(createGet(1, 'firstName'), '=', 'John')
                                ),
                                createAnd(
                                    createComparison(createGet(1, 'lastName'), '=', 'Doe')
                                )
                            ]
                        )
                    )
                )
            })

            it('with parentheses around each literal', () => {
                assert.deepEqual(
                    parsePredicate<Employee>(e => (e.title == 'CEO') && (e.firstName == 'John') && (e.lastName == 'Doe')),
                    createConcatenation(
                        createInsideParentheses(
                            createComparison(createGet(1, 'title'), '=', 'CEO')
                        ),
                        [
                            createAnd(
                                createInsideParentheses(
                                    createComparison(createGet(1, 'firstName'), '=', 'John')
                                )
                            ),
                            createAnd(
                                createInsideParentheses(
                                    createComparison(createGet(1, 'lastName'), '=', 'Doe')
                                )
                            )
                        ]
                    )
                )
            })

            it('with parentheses around the first literal', () => {
                assert.deepEqual(
                    parsePredicate<Employee>(e => (e.title == 'CEO') && e.firstName == 'John' && e.lastName == 'Doe'),
                    createConcatenation(
                        createInsideParentheses(
                            createComparison(createGet(1, 'title'), '=', 'CEO')
                        ),
                        [
                            createAnd(
                                createComparison(createGet(1, 'firstName'), '=', 'John')
                            ),
                            createAnd(
                                createComparison(createGet(1, 'lastName'), '=', 'Doe')
                            )
                        ]
                    ))
            })

            it('with parentheses around the second literal', () => {
                assert.deepEqual(
                    parsePredicate<Employee>(e => e.title == 'CEO' && (e.firstName == 'John') && e.lastName == 'Doe'),
                    createConcatenation(
                        createComparison(createGet(1, 'title'), '=', 'CEO'),
                        [
                            createAnd(
                                createInsideParentheses(
                                    createComparison(createGet(1, 'firstName'), '=', 'John')
                                )
                            ),
                            createAnd(
                                createComparison(createGet(1, 'lastName'), '=', 'Doe')
                            )
                        ]
                    )
                )
            })

            it('with parentheses around the first two literals', () => {
                assert.deepEqual(
                    parsePredicate<Employee>(e => (e.title == 'CEO' && e.firstName == 'John') && e.lastName == 'Doe'),
                    createConcatenation(
                        createInsideParentheses(
                            createConcatenation(
                                createComparison(createGet(1, 'title'), '=', 'CEO'),
                                [
                                    createAnd(
                                        createComparison(createGet(1, 'firstName'), '=', 'John')
                                    )
                                ]
                            )
                        ),
                        [
                            createAnd(
                                createComparison(createGet(1, 'lastName'), '=', 'Doe')
                            )
                        ]
                    )
                )
            })

            it('with parentheses around the last two literals', () => {
                assert.deepEqual(
                    parsePredicate<Employee>(e => e.title == 'CEO' && (e.firstName == 'John' && e.lastName == 'Doe')),
                    createConcatenation(
                        createComparison(createGet(1, 'title'), '=', 'CEO'),
                        [
                            createAnd(
                                createInsideParentheses(
                                    createConcatenation(
                                        createComparison(createGet(1, 'firstName'), '=', 'John'),
                                        [
                                            createAnd(
                                                createComparison(createGet(1, 'lastName'), '=', 'Doe')
                                            )
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
                parsePredicate<Employee>(e => (e.firstName == 'John' || e.firstName == 'Richard') && (e.lastName == 'Doe' || e.lastName == 'Roe')),
                createConcatenation(
                    createInsideParentheses(
                        createConcatenation(
                            createComparison(createGet(1, 'firstName'), '=', 'John'),
                            [
                                createOr(
                                    createComparison(createGet(1, 'firstName'), '=', 'Richard')
                                )
                            ],
                        )
                    ),
                    [
                        createAnd(
                            createInsideParentheses(
                                createConcatenation(
                                    createComparison(createGet(1, 'lastName'), '=', 'Doe'),
                                    [
                                        createOr(
                                            createComparison(createGet(1, 'lastName'), '=', 'Roe'))

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
                parsePredicate<Employee>(e => e.firstName == 'Jim' || e.firstName == 'James'),
                createConcatenation(
                    createComparison(createGet(1, 'firstName'), '=', 'Jim'),
                    [
                        createOr(
                            createComparison(createGet(1, 'firstName'), '=', 'James')
                        )
                    ]
                )
            )
        })

        it('of two conjunctions', () => {
            assert.deepEqual(
                parsePredicate<Employee>(e => e.firstName == 'John' && e.lastName == 'Doe' || e.firstName == 'Richard' && e.lastName == 'Roe'),
                createConcatenation(
                    createComparison(createGet(1, 'firstName'), '=', 'John'),
                    [
                        createAnd(
                            createComparison(createGet(1, 'lastName'), '=', 'Doe')
                        ),
                        createOr(
                            createComparison(createGet(1, 'firstName'), '=', 'Richard')
                        ),
                        createAnd(
                            createComparison(createGet(1, 'lastName'), '=', 'Roe')
                        )
                    ]
                )
            )
        })

    })
})