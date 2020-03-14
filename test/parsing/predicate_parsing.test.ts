import {Employee} from '../test_tables'
import {
    createComparison, createConcatenation,
    createInsideParentheses,
    createTailItem,
    parsePredicate
} from '../../lib/parsing/predicate_parsing'
import * as assert from 'assert'

describe('parsePredicate', () => {
    describe('can parse comparisons', () => {
        describe('with a double equality sign', () => {
            it('with an integer', () => {
                assert.deepEqual(
                    parsePredicate<Employee>(e => e.id === 1),
                    createComparison({object: 'e', property: 'id'}, '=', 1))
            })

            describe('with a string', () => {
                describe('surrounded by', () => {
                    it('single quotes', () => {
                        assert.deepEqual(
                            parsePredicate<Employee>(e => e.title == 'some title'),
                            createComparison({object: 'e', property: 'title'}, '=', 'some title'))
                    })

                    it('double quotes', () => {
                        assert.deepEqual(
                            parsePredicate<Employee>(e => e.title == "some title"),
                            createComparison({object: 'e', property: 'title'}, '=', 'some title'))
                    })
                })

                describe('containing', () => {
                    it('parentheses', () => {
                        assert.deepEqual(
                            parsePredicate<Employee>(e => e.title == '(text in parentheses)'),
                            createComparison({object: 'e', property: 'title'}, '=', '(text in parentheses)'))
                    })

                    it('double parentheses', () => {
                        assert.deepEqual(
                            parsePredicate<Employee>(e => e.title == '((text in parentheses))'),
                            createComparison({object: 'e', property: 'title'}, '=', '((text in parentheses))'))
                    })

                    it('escaped single quotes', () => {
                        assert.deepEqual(
                            parsePredicate<Employee>(e => e.title == 'I\'m'),
                            createComparison({object: 'e', property: 'title'}, '=', "I\\'m"))
                    })
                })

            })
        })
        describe('with a triple equality sign', () => {
            it('with an integer', () => {
                assert.deepEqual(
                    parsePredicate<Employee>(e => e.id === 1),
                    createComparison({object: 'e', property: 'id'}, '=', 1))
            })

            it('with a string', () => {
                assert.deepEqual(
                    parsePredicate<Employee>(e => e.title === 'some title'),
                    createComparison({object: 'e', property: 'title'}, '=', 'some title'))
            })
        })
    })

    describe('can parse parentheses containing a comparison', () => {
        it('with an integer', () => {
            assert.deepEqual(
                parsePredicate<Employee>(e => (e.id == 1)),
                createInsideParentheses(createComparison({object: 'e', property: 'id'}, '=', 1)))
        })

        it('with a string', () => {
            assert.deepEqual(
                parsePredicate<Employee>(e => (e.title == 'some title')),
                createInsideParentheses(createComparison({object: 'e', property: 'title'}, '=', 'some title')))
        })
    })

    describe('can parse parentheses inside parentheses containing a comparison', () => {
        it('with an integer', () => {
            assert.deepEqual(
                parsePredicate<Employee>(e => ((e.id == 1))),
                createInsideParentheses(createInsideParentheses(createComparison({object: 'e', property: 'id'}, '=', 1))))
        })

        it('with a string', () => {
            assert.deepEqual(
                parsePredicate<Employee>(e => ((e.title == 'some title'))),
                createInsideParentheses(createInsideParentheses(createComparison({object: 'e', property: 'title'}, '=', 'some title'))))
        })
    })

    describe('can parse a conjunction', () => {

        describe('of two literals', () => {
            it('without parentheses', () => {
                assert.deepEqual(
                    parsePredicate<Employee>(e => e.firstName == 'John' && e.lastName == 'Doe'),
                    createConcatenation(
                        createComparison({object: 'e', property: 'firstName'}, '=', 'John'),
                        [
                            createTailItem('&&', createComparison({object: 'e', property: 'lastName'}, '=', 'Doe'))
                        ]
                    ))
            })

            it('with parentheses around the conjunction', () => {
                assert.deepEqual(
                    parsePredicate<Employee>(e => (e.firstName == 'John' && e.lastName == 'Doe')),
                    createInsideParentheses(
                        createConcatenation(
                            createComparison({object: 'e', property: 'firstName'}, '=', 'John'),
                            [
                                createTailItem('&&', createComparison({object: 'e', property: 'lastName'}, '=', 'Doe'))
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
                            createComparison({object: 'e', property: 'firstName'}, '=', 'John')
                        ),
                        [
                            createTailItem(
                                '&&',
                                createInsideParentheses(
                                    createComparison({object: 'e', property: 'lastName'}, '=', 'Doe')
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
                            createComparison({object: 'e', property: 'firstName'}, '=', 'John')
                        ),
                        [
                            createTailItem(
                                '&&',
                                createComparison({object: 'e', property: 'lastName'}, '=', 'Doe')
                            )
                        ]
                    ))
            })

            it('with parentheses around the second of the two literals', () => {
                assert.deepEqual(
                    parsePredicate<Employee>(e => e.firstName == 'John' && (e.lastName == 'Doe')),
                    createConcatenation(
                        createComparison({object: 'e', property: 'firstName'}, '=', 'John'),
                        [
                            createTailItem(
                                '&&',
                                createInsideParentheses(
                                    createComparison({object: 'e', property: 'lastName'}, '=', 'Doe')
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
                        createComparison({object: 'e', property: 'title'}, '=', 'CEO'),
                        [
                            createTailItem(
                                '&&',
                                createComparison({object: 'e', property: 'firstName'}, '=', 'John')
                            ),
                            createTailItem(
                                '&&',
                                createComparison({object: 'e', property: 'lastName'}, '=', 'Doe')
                            )
                        ]
                    ))
            })

            it('with parentheses around the conjunction', () => {
                assert.deepEqual(
                    parsePredicate<Employee>(e => (e.title == 'CEO' && e.firstName == 'John' && e.lastName == 'Doe')),
                    createInsideParentheses(
                        createConcatenation(
                            createComparison({object: 'e', property: 'title'}, '=', 'CEO'),
                            [
                                createTailItem(
                                    '&&',
                                    createComparison({object: 'e', property: 'firstName'}, '=', 'John')
                                ),
                                createTailItem(
                                    '&&',
                                    createComparison({object: 'e', property: 'lastName'}, '=', 'Doe')
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
                            createComparison({object: 'e', property: 'title'}, '=', 'CEO')
                        ),
                        [
                            createTailItem(
                                '&&',
                                createInsideParentheses(
                                    createComparison({object: 'e', property: 'firstName'}, '=', 'John')
                                )
                            ),
                            createTailItem(
                                '&&',
                                createInsideParentheses(
                                    createComparison({object: 'e', property: 'lastName'}, '=', 'Doe')
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
                            createComparison({object: 'e', property: 'title'}, '=', 'CEO')
                        ),
                        [
                            createTailItem(
                                '&&',
                                createComparison({object: 'e', property: 'firstName'}, '=', 'John')
                            ),
                            createTailItem(
                                '&&',
                                createComparison({object: 'e', property: 'lastName'}, '=', 'Doe')
                            )
                        ]
                    ))
            })

            it('with parentheses around the second literal', () => {
                assert.deepEqual(
                    parsePredicate<Employee>(e => e.title == 'CEO' && (e.firstName == 'John') && e.lastName == 'Doe'),
                    createConcatenation(
                        createComparison({object: 'e', property: 'title'}, '=', 'CEO'),
                        [
                            createTailItem(
                                '&&',
                                createInsideParentheses(
                                    createComparison({object: 'e', property: 'firstName'}, '=', 'John')
                                )
                            ),
                            createTailItem(
                                '&&',
                                createComparison({object: 'e', property: 'lastName'}, '=', 'Doe')
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
                                createComparison({object: 'e', property: 'title'}, '=', 'CEO'),
                                [
                                    createTailItem(
                                        '&&',
                                        createComparison({object: 'e', property: 'firstName'}, '=', 'John')
                                    )
                                ]
                            )
                        ),
                        [
                            createTailItem(
                                '&&',
                                createComparison({object: 'e', property: 'lastName'}, '=', 'Doe')
                            )
                        ]
                    )
                )
            })

            it('with parentheses around the last two literals', () => {
                assert.deepEqual(
                    parsePredicate<Employee>(e => e.title == 'CEO' && (e.firstName == 'John' && e.lastName == 'Doe')),
                    createConcatenation(
                        createComparison({object: 'e', property: 'title'}, '=', 'CEO'),
                        [
                            createTailItem(
                                '&&',
                                createInsideParentheses(
                                    createConcatenation(
                                        createComparison({object: 'e', property: 'firstName'}, '=', 'John'),
                                        [
                                            createTailItem(
                                                '&&',
                                                createComparison({object: 'e', property: 'lastName'}, '=', 'Doe')
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
                            createComparison({object: 'e', property: 'firstName'}, '=', 'John'),
                            [
                                createTailItem(
                                    '||',
                                    createComparison({object: 'e', property: 'firstName'}, '=', 'Richard')
                                )
                            ],
                        )
                    ),
                    [
                        createTailItem(
                            '&&',
                            createInsideParentheses(
                                createConcatenation(
                                    createComparison({object: 'e', property: 'lastName'}, '=', 'Doe'),
                                    [
                                        createTailItem(
                                            '||',
                                            createComparison({object: 'e', property: 'lastName'}, '=', 'Roe'))
                                    ]
                                )
                            )
                        )
                    ])
            )
        })
    })

    describe('can parse a disjunction', () => {

        it('of two literals', () => {
            assert.deepEqual(
                parsePredicate<Employee>(e => e.firstName == 'Jim' || e.firstName == 'James'),
                createConcatenation(
                    createComparison({object: 'e', property: 'firstName'}, '=', 'Jim'),
                    [
                        createTailItem(
                            '||',
                            createComparison({object: 'e', property: 'firstName'}, '=', 'James')
                        )
                    ]
                )
            )
        })

        it('of two conjunctions', () => {
            assert.deepEqual(
                parsePredicate<Employee>(e => e.firstName == 'John' && e.lastName == 'Doe' || e.firstName == 'Richard' && e.lastName == 'Roe'),
                {
                    head: createComparison({object: 'e', property: 'firstName'}, '=', 'John'),
                    tail: [
                        createTailItem(
                            '&&',
                            createComparison({object: 'e', property: 'lastName'}, '=', 'Doe')
                        ),
                        createTailItem(
                            '||',
                            createComparison({object: 'e', property: 'firstName'}, '=', 'Richard')
                        ),
                        createTailItem(
                            '&&',
                            createComparison({object: 'e', property: 'lastName'}, '=', 'Roe')
                        )
                    ],
                    kind: 'concatenation'
                }
            )
        })

    })
})