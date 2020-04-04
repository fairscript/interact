import {createEqual} from '../../../../../lib/parsing/boolean_expressions/comparisons'
import {createGetColumn} from '../../../../../lib/parsing/value_expressions/get_column_parsing'
import {createAssertParameterlessPredicateParserMatches} from '../../predicate_assertion'
import {createParameterlessParser} from '../../../../../lib/parsing/boolean_expressions/boolean_expression_parsing'
import {createInsideParentheses} from '../../../../../lib/parsing/boolean_expressions/inside_parentheses'
import {createAnd, createConcatenation, createOr} from '../../../../../lib/parsing/boolean_expressions/concatenation'
import {createNegation} from '../../../../../lib/parsing/boolean_expressions/negation_parsing'
import {createLiteral} from '../../../../../lib/parsing/values/literal'

const parser = createParameterlessParser(['e'])
const assertMatches = createAssertParameterlessPredicateParserMatches(parser)

describe('parseParameterlessPredicate can parse', () => {
    const getFirstName = createGetColumn('e', 'firstName')
    const firstNameEqualsJohn = createEqual(getFirstName, createLiteral('John'))
    const lastNameEqualsDoe = createEqual(createGetColumn('e', 'lastName'), createLiteral('Doe'))

    const firstNameEqualsJim = createEqual(getFirstName, createLiteral('Jim'))
    const firstNameEqualsJames = createEqual(getFirstName, createLiteral('James'))
    const firstNameEqualsJimmy = createEqual(getFirstName, createLiteral('Jimmy'))

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