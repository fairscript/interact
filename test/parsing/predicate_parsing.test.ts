import {Employee} from '../test_tables'
import {parsePredicate} from '../../lib/parsing/predicate_parsing'
import * as assert from 'assert'

describe('parsePredicate', () => {
    describe('can parse comparisons', () => {
        describe('with a double equality sign', () => {
            it('with an integer', () => {
                assert.deepEqual(
                    parsePredicate<Employee>(e => e.id === 1),
                    { left: {object: 'e', property: 'id'}, operator: '=', right: 1, kind: 'comparison' })
            })

            describe('with a string', () => {
                describe('surrounded by', () => {
                    it('single quotes', () => {
                        assert.deepEqual(
                            parsePredicate<Employee>(e => e.title == 'some title'),
                            { left: {object: 'e', property: 'title'}, operator: '=', right: 'some title', kind: 'comparison' })
                    })

                    it('double quotes', () => {
                        assert.deepEqual(
                            parsePredicate<Employee>(e => e.title == "some title"),
                            { left: {object: 'e', property: 'title'}, operator: '=', right: 'some title', kind: 'comparison' })
                    })
                })

                describe('containing', () => {
                    it('parentheses', () => {
                        assert.deepEqual(
                            parsePredicate<Employee>(e => e.title == '(text in parentheses)'),
                            { left: {object: 'e', property: 'title'}, operator: '=', right: '(text in parentheses)', kind: 'comparison' })
                    })

                    it('double parentheses', () => {
                        assert.deepEqual(
                            parsePredicate<Employee>(e => e.title == '((text in parentheses))'),
                            { left: {object: 'e', property: 'title'}, operator: '=', right: '((text in parentheses))', kind: 'comparison' })
                    })

                    it('escaped single quotes', () => {
                        assert.deepEqual(
                            parsePredicate<Employee>(e => e.title == 'I\'m'),
                            { left: {object: 'e', property: 'title'}, operator: '=', right: "I\\'m", kind: 'comparison' })
                    })
                })

            })
        })
        describe('with a triple equality sign', () => {
            it('with an integer', () => {
                assert.deepEqual(
                    parsePredicate<Employee>(e => e.id === 1),
                    { left: {object: 'e', property: 'id'}, operator: '=', right: 1, kind: 'comparison' })
            })

            it('with a string', () => {
                assert.deepEqual(
                    parsePredicate<Employee>(e => e.title === 'some title'),
                    { left: {object: 'e', property: 'title'}, operator: '=', right: 'some title', kind: 'comparison' })
            })
        })
    })

    describe('can parse parentheses containing a comparison', () => {
        it('with an integer', () => {
            assert.deepEqual(
                parsePredicate<Employee>(e => (e.id == 1)),
                {
                    inside: { left: {object: 'e', property: 'id'}, operator: '=', right: 1, kind: 'comparison' },
                    kind: 'inside'
                })
        })

        it('with a string', () => {
            assert.deepEqual(
                parsePredicate<Employee>(e => (e.title == 'some title')),
                {
                    inside: { left: {object: 'e', property: 'title'}, operator: '=', right: 'some title', kind: 'comparison' },
                    kind: 'inside'
                })
        })
    })

    describe('can parse parentheses inside parentheses containing a comparison', () => {
        it('with an integer', () => {
            assert.deepEqual(
                parsePredicate<Employee>(e => ((e.id == 1))),
                {
                    inside: {
                        inside: { left: {object: 'e', property: 'id'}, operator: '=', right: 1, kind: 'comparison' },
                        kind: 'inside'
                    },
                    kind: 'inside'
                })
        })

        it('with a string', () => {
            assert.deepEqual(
                parsePredicate<Employee>(e => ((e.title == 'some title'))),
                {
                    inside: {
                        inside: {left: {object: 'e', property: 'title'}, operator: '=', right: 'some title', kind: 'comparison'},
                        kind: 'inside'
                    },
                    kind: 'inside'
                })
        })
    })

    describe('can parse a conjunction', () => {

        describe('of two literals', () => {
            it('without parentheses', () => {
                assert.deepEqual(
                    parsePredicate<Employee>(e => e.firstName == 'John' && e.lastName == 'Doe'),
                    {
                        head: {
                            left: {object: 'e', property: 'firstName'}, operator: '=', right: 'John', kind: 'comparison'
                        },
                        tail: [
                            {
                                operator: '&&',
                                expression: {left: {object: 'e', property: 'lastName'}, operator: '=', right: 'Doe', kind: 'comparison'}
                            }
                        ],
                        kind: 'concatenation'
                    })
            })

            it('with parentheses around the conjunction', () => {
                assert.deepEqual(
                    parsePredicate<Employee>(e => (e.firstName == 'John' && e.lastName == 'Doe')),
                    {
                        inside: {
                            head: {
                                left: {object: 'e', property: 'firstName'}, operator: '=', right: 'John', kind: 'comparison'
                            },
                            tail: [
                                {
                                    operator: '&&',
                                    expression: {left: {object: 'e', property: 'lastName'}, operator: '=', right: 'Doe', kind: 'comparison'}
                                }
                            ],
                            kind: 'concatenation'
                        },
                        kind: 'inside'
                    })
            })

            it('with parentheses around each literal', () => {
                assert.deepEqual(
                    parsePredicate<Employee>(e => (e.firstName == 'John') && (e.lastName == 'Doe')),
                    {
                        head: {
                            inside: {
                                left: {object: 'e', property: 'firstName'}, operator: '=', right: 'John', kind: 'comparison'
                            },
                            kind: 'inside'
                        },
                        tail: [
                            {
                                operator: '&&',
                                expression: {
                                    inside: {
                                        left: {object: 'e', property: 'lastName'}, operator: '=', right: 'Doe', kind: 'comparison'
                                    },
                                    kind: 'inside'
                                }
                            }
                        ],
                        kind: 'concatenation'
                    })
            })

            it('with parentheses around the first of the two literals', () => {
                assert.deepEqual(
                    parsePredicate<Employee>(e => (e.firstName == 'John') && e.lastName == 'Doe'),
                    {
                        head: {
                            inside: {
                                left: {object: 'e', property: 'firstName'}, operator: '=', right: 'John', kind: 'comparison'
                            },
                            kind: 'inside'
                        },
                        tail: [
                            {
                                operator: '&&',
                                expression: {left: {object: 'e', property: 'lastName'}, operator: '=', right: 'Doe', kind: 'comparison'}
                            }
                        ],
                        kind: 'concatenation'
                    })
            })

            it('with parentheses around the second of the two literals', () => {
                assert.deepEqual(
                    parsePredicate<Employee>(e => e.firstName == 'John' && (e.lastName == 'Doe')),
                    {
                        head: {left: {object: 'e', property: 'firstName'}, operator: '=', right: 'John', kind: 'comparison'},
                        tail: [
                            {
                                operator: '&&',
                                expression: {
                                    inside: {
                                        left: {object: 'e', property: 'lastName'}, operator: '=', right: 'Doe', kind: 'comparison'
                                    },
                                    kind: 'inside'
                                }
                            }
                        ],
                        kind: 'concatenation'
                    })
            })
        })

        describe('of three literals', () => {
            it('with no parentheses', () => {
                assert.deepEqual(
                    parsePredicate<Employee>(e => e.title == 'CEO' && e.firstName == 'John' && e.lastName == 'Doe'),
                    {
                        head: {left: {object: 'e', property: 'title'}, operator: '=', right: 'CEO', kind: 'comparison'},
                        tail: [
                            {
                                operator: '&&',
                                expression: {left: {object: 'e', property: 'firstName'}, operator: '=', right: 'John', kind: 'comparison'}
                            },
                            {
                                operator: '&&',
                                expression: {left: {object: 'e', property: 'lastName'}, operator: '=', right: 'Doe', kind: 'comparison'}
                            }
                        ],
                        kind: 'concatenation'
                    })
            })

            it('with parentheses around the conjunction', () => {
                assert.deepEqual(
                    parsePredicate<Employee>(e => (e.title == 'CEO' && e.firstName == 'John' && e.lastName == 'Doe')),
                    {
                        inside: {
                            head: {left: {object: 'e', property: 'title'}, operator: '=', right: 'CEO', kind: 'comparison'},
                            tail: [
                                {
                                    operator: '&&',
                                    expression: {left: {object: 'e', property: 'firstName'}, operator: '=', right: 'John', kind: 'comparison'}
                                },
                                {
                                    operator: '&&',
                                    expression: {left: {object: 'e', property: 'lastName'}, operator: '=', right: 'Doe', kind: 'comparison'}
                                }
                            ],
                            kind: 'concatenation'
                        },
                        kind: 'inside'
                    })
            })

            it('with parentheses around each literal', () => {
                assert.deepEqual(
                    parsePredicate<Employee>(e => (e.title == 'CEO') && (e.firstName == 'John') && (e.lastName == 'Doe')),
                    {
                        head: {
                            inside: {
                                left: {object: 'e', property: 'title'}, operator: '=', right: 'CEO', kind: 'comparison'
                            },
                            kind: 'inside'
                        },
                        tail: [
                            {
                                operator: '&&',
                                expression: {
                                    inside: {left: {object: 'e', property: 'firstName'}, operator: '=', right: 'John', kind: 'comparison'},
                                    kind: 'inside'
                                }
                            },
                            {
                                operator: '&&',
                                expression: {
                                    inside: {left: {object: 'e', property: 'lastName'}, operator: '=', right: 'Doe', kind: 'comparison'},
                                    kind: 'inside'
                                }
                            }
                        ],
                        kind: 'concatenation'
                    })
            })

            it('with parentheses around the first literal', () => {
                assert.deepEqual(
                    parsePredicate<Employee>(e => (e.title == 'CEO') && e.firstName == 'John' && e.lastName == 'Doe'),
                    {
                        head: {
                            inside: {
                                left: {object: 'e', property: 'title'}, operator: '=', right: 'CEO', kind: 'comparison'
                            },
                            kind: 'inside'
                        },
                        tail: [
                            {
                                operator: '&&',
                                expression: {left: {object: 'e', property: 'firstName'}, operator: '=', right: 'John', kind: 'comparison'}
                            },
                            {
                                operator: '&&',
                                expression: {left: {object: 'e', property: 'lastName'}, operator: '=', right: 'Doe', kind: 'comparison'}
                            }
                        ],
                        kind: 'concatenation'
                    })
            })

            it('with parentheses around the second literal', () => {
                assert.deepEqual(
                    parsePredicate<Employee>(e => e.title == 'CEO' && (e.firstName == 'John') && e.lastName == 'Doe'),
                    {
                        head: {
                            left: {object: 'e', property: 'title'}, operator: '=', right: 'CEO', kind: 'comparison'
                        },
                        tail: [
                            {
                                operator: '&&',
                                expression: {
                                    inside: {left: {object: 'e', property: 'firstName'}, operator: '=', right: 'John', kind: 'comparison'},
                                    kind: 'inside'
                                },
                            },
                            {
                                operator: '&&',
                                expression: {left: {object: 'e', property: 'lastName'}, operator: '=', right: 'Doe', kind: 'comparison'}
                            }
                        ],
                        kind: 'concatenation'
                    })
            })

            it('with parentheses around the first two literals', () => {
                assert.deepEqual(
                    parsePredicate<Employee>(e => (e.title == 'CEO' && e.firstName == 'John') && e.lastName == 'Doe'),
                    {
                        head: {
                            inside: {
                                head: {
                                    left: {object: 'e', property: 'title'}, operator: '=', right: 'CEO', kind: 'comparison'
                                },
                                tail: [
                                    {
                                        operator: '&&',
                                        expression: {left: {object: 'e', property: 'firstName'}, operator: '=', right: 'John', kind: 'comparison'},
                                    }
                                ],
                                kind: 'concatenation'
                            },
                            kind: 'inside'
                        },
                        tail: [
                            {
                                operator: '&&',
                                expression: {left: {object: 'e', property: 'lastName'}, operator: '=', right: 'Doe', kind: 'comparison'}
                            }
                        ],
                        kind: 'concatenation'
                    })
            })

            it('with parentheses around the last two literals', () => {
                assert.deepEqual(
                    parsePredicate<Employee>(e => e.title == 'CEO' && (e.firstName == 'John' && e.lastName == 'Doe')),
                    {
                        head: {left: {object: 'e', property: 'title'}, operator: '=', right: 'CEO', kind: 'comparison'},
                        tail: [
                            {
                                expression: {
                                    inside: {
                                        head: {left: {object: 'e', property: 'firstName'}, operator: '=', right: 'John', kind: 'comparison'},
                                        tail: [
                                            {
                                                operator: '&&',
                                                expression: {left: {object: 'e', property: 'lastName'}, operator: '=', right: 'Doe', kind: 'comparison'}
                                            }
                                        ],
                                        kind: 'concatenation'
                                    },
                                    kind: 'inside'
                                },
                                operator: '&&'
                            }
                        ],
                        kind: 'concatenation'
                    })
            })
        })

        it('of two disjunctions', () => {
            assert.deepEqual(
                parsePredicate<Employee>(e => (e.firstName == 'John' || e.firstName == 'Richard') && (e.lastName == 'Doe' || e.lastName == 'Roe')),
                {
                    head: {
                        inside: {
                            head: {left: {object: 'e', property: 'firstName'}, operator: '=', right: 'John', kind: 'comparison'},
                            tail: [
                                {
                                    expression: {left: {object: 'e', property: 'firstName'}, operator: '=', right: 'Richard', kind: 'comparison'},
                                    operator: '||'
                                }
                            ],
                            kind: 'concatenation'
                        },
                        kind: 'inside'
                    },
                    tail: [
                        {
                            expression: {
                                inside: {
                                    head: {left: {object: 'e', property: 'lastName'}, operator: '=', right: 'Doe', kind: 'comparison'},
                                    tail: [
                                        {
                                            expression: {left: {object: 'e', property: 'lastName'}, operator: '=', right: 'Roe', kind: 'comparison'},
                                            operator: '||'
                                        }
                                    ],
                                    kind: 'concatenation'
                                },
                                kind: 'inside'
                            },
                            operator: '&&'
                        }
                    ],
                    kind: 'concatenation'
                })
        })
    })

    describe('can parse a disjunction', () => {

        it('of two literals', () => {
            assert.deepEqual(
                parsePredicate<Employee>(e => e.firstName == 'Jim' || e.firstName == 'James'),
                {
                    head: {
                        left: {object: 'e', property: 'firstName'}, operator: '=', right: 'Jim', kind: 'comparison'
                    },
                    tail: [
                        {
                            operator: '||',
                            expression: {left: {object: 'e', property: 'firstName'}, operator: '=', right: 'James', kind: 'comparison'}
                        }
                    ],
                    kind: 'concatenation'
                })
        })

        it('of two conjunctions', () => {
            assert.deepEqual(
                parsePredicate<Employee>(e => e.firstName == 'John' && e.lastName == 'Doe' || e.firstName == 'Richard' && e.lastName == 'Roe'),
                {
                    head: {left: {object: 'e', property: 'firstName'}, operator: '=', right: 'John', kind: 'comparison'},
                    tail: [
                        {
                            expression: {left: {object: 'e', property: 'lastName'}, operator: '=', right: 'Doe', kind: 'comparison'},
                            operator: '&&'
                        },
                        {
                            expression: {left: {object: 'e', property: 'firstName'}, operator: '=', right: 'Richard', kind: 'comparison'},
                            operator: '||'
                        },
                        {
                            expression: {left: {object: 'e', property: 'lastName'}, operator: '=', right: 'Roe', kind: 'comparison' },
                            operator: '&&'
                        }
                    ],
                    kind: 'concatenation'
                }
            )
        })

    })
})