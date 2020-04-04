import {createEqual} from '../../../../../lib/parsing/predicates/comparisons'
import {createGetColumn} from '../../../../../lib/parsing/get_column_parsing'
import {createConstant} from '../../../../../lib/parsing/predicates/side_parsing'
import {createAssertParameterlessPredicateParserMatches} from '../../predicate_assertion'
import {createParameterlessParser} from '../../../../../lib/parsing/predicates/predicate_parsing'
import {createInsideParentheses} from '../../../../../lib/parsing/predicates/inside_parentheses'
import {createAnd, createConcatenation, createOr} from '../../../../../lib/parsing/predicates/concatenation'
import {createNegation} from '../../../../../lib/parsing/predicates/negation_parsing'

const parser = createParameterlessParser(['e'])
const assertMatches = createAssertParameterlessPredicateParserMatches(parser)

describe('parseParameterlessPredicate can parse', () => {
    const getFirstName = createGetColumn('e', 'firstName')
    const firstNameEqualsJohn = createEqual(getFirstName, createConstant('John'))
    const lastNameEqualsDoe = createEqual(createGetColumn('e', 'lastName'), createConstant('Doe'))

    const firstNameEqualsJim = createEqual(getFirstName, createConstant('Jim'))
    const firstNameEqualsJames = createEqual(getFirstName, createConstant('James'))
    const firstNameEqualsJimmy = createEqual(getFirstName, createConstant('Jimmy'))

    describe('a negated concatenation of', () => {
        it('two literals', () => {
            assertMatches(
                e => !(e.firstName === 'John' && e.lastName === 'Doe'),
                createNegation(
                    createInsideParentheses(
                        createConcatenation(
                            firstNameEqualsJohn,
                            [
                                createAnd(lastNameEqualsDoe)
                            ]
                        )
                    )
                )
            )
        })

        it('three literals', () => {
            assertMatches(
                e => !(e.firstName === 'Jim' || e.firstName === 'James' || e.firstName === 'Jimmy'),
                createNegation(
                    createInsideParentheses(
                        createConcatenation(
                            firstNameEqualsJim,
                            [
                                createOr(firstNameEqualsJames),
                                createOr(firstNameEqualsJimmy)
                            ]
                        )
                    )
                )
            )
        })
    })

    describe('a concatenation of', () => {

        describe('two literals, with parentheses around', () => {
            it('the entire expression', () => {
                assertMatches(
                    e => (e.firstName === 'John' && e.lastName === 'Doe'),
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

            it('parentheses around the entire concatenation', () => {
                assertMatches(
                    e => ((e.firstName === 'John' && e.lastName === 'Doe')),
                    createInsideParentheses(
                        createInsideParentheses(
                            createConcatenation(
                                firstNameEqualsJohn,
                                [
                                    createAnd(lastNameEqualsDoe)
                                ]
                            )
                        )
                    )
                )
            })

            it('each literal', () => {
                assertMatches(
                    e => (e.firstName === 'John') && (e.lastName === 'Doe'),
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

            it('the first of the two literals', () => {
                assertMatches(
                    e => (e.firstName === 'John') && e.lastName === 'Doe',
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

            it('the second of the two literals', () => {
                assertMatches(
                    e => e.firstName === 'John' && (e.lastName === 'Doe'),
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

        describe('three literals, with parentheses around', () => {
            it('the entire expression', () => {
                assertMatches(
                    e => (e.firstName === 'Jim' || e.firstName === 'James' || e.firstName === 'Jimmy'),
                    createInsideParentheses(
                        createConcatenation(
                            firstNameEqualsJim,
                            [
                                createOr(firstNameEqualsJames),
                                createOr(firstNameEqualsJimmy)
                            ]
                        )
                    )
                )
            })

            it('parentheses around the entire expression', () => {
                assertMatches(
                    e => ((e.firstName === 'Jim' || e.firstName === 'James' || e.firstName === 'Jimmy')),
                    createInsideParentheses(
                        createInsideParentheses(
                            createConcatenation(
                                firstNameEqualsJim,
                                [
                                    createOr(firstNameEqualsJames),
                                    createOr(firstNameEqualsJimmy)
                                ]
                            )
                        )
                    )
                )
            })

            it('each literal', () => {
                assertMatches(
                    e => (e.firstName === 'Jim') || (e.firstName === 'James') || (e.firstName === 'Jimmy'),
                    createConcatenation(
                        createInsideParentheses(firstNameEqualsJim),
                        [
                            createOr(createInsideParentheses(firstNameEqualsJames)),
                            createOr(createInsideParentheses(firstNameEqualsJimmy))
                        ]
                    )
                )
            })

            it('the first literal', () => {
                assertMatches(
                    e => (e.firstName === 'Jim') || e.firstName === 'James' || e.firstName === 'Jimmy',
                    createConcatenation(
                        createInsideParentheses(firstNameEqualsJim),
                        [
                            createOr(firstNameEqualsJames),
                            createOr(firstNameEqualsJimmy)
                        ]
                    )
                )
            })

            it('the second literal', () => {
                assertMatches(
                    e => e.firstName === 'Jim' || (e.firstName === 'James') || e.firstName === 'Jimmy',
                    createConcatenation(
                        firstNameEqualsJim,
                        [
                            createOr(createInsideParentheses(firstNameEqualsJames)),
                            createOr(firstNameEqualsJimmy)
                        ]
                    )
                )
            })

            it('the third literal', () => {
                assertMatches(
                    e => e.firstName === 'Jim' || e.firstName === 'James' || (e.firstName === 'Jimmy'),
                    createConcatenation(
                        firstNameEqualsJim,
                        [
                            createOr(firstNameEqualsJames),
                            createOr(createInsideParentheses(firstNameEqualsJimmy))
                        ]
                    )
                )
            })

            it('the first and second literal', () => {
                assertMatches(
                    e => (e.firstName === 'Jim') || (e.firstName === 'James') || e.firstName === 'Jimmy',
                    createConcatenation(
                        createInsideParentheses(firstNameEqualsJim),
                        [
                            createOr(createInsideParentheses(firstNameEqualsJames)),
                            createOr(firstNameEqualsJimmy)
                        ]
                    )
                )
            })

            it('the second and third literal', () => {
                assertMatches(
                    e => e.firstName === 'Jim' || (e.firstName === 'James') || (e.firstName === 'Jimmy'),
                    createConcatenation(
                        firstNameEqualsJim,
                        [
                            createOr(createInsideParentheses(firstNameEqualsJames)),
                            createOr(createInsideParentheses(firstNameEqualsJimmy))
                        ]
                    )
                )
            })

            it('the first and third literal', () => {
                assertMatches(
                    e => (e.firstName === 'Jim') || e.firstName === 'James' || (e.firstName === 'Jimmy'),
                    createConcatenation(
                        createInsideParentheses(firstNameEqualsJim),
                        [
                            createOr(firstNameEqualsJames),
                            createOr(createInsideParentheses(firstNameEqualsJimmy))
                        ]
                    )
                )
            })
        })
    })

})