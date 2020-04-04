import {createEqual, createGreaterThan} from '../../../../../lib/parsing/predicates/comparisons'
import {createGetColumn} from '../../../../../lib/parsing/get_column_parsing'
import {createAssertParameterlessPredicateParserMatches} from '../../predicate_assertion'
import {createParameterlessParser} from '../../../../../lib/parsing/predicates/predicate_parsing'
import {createInsideParentheses} from '../../../../../lib/parsing/predicates/inside_parentheses'
import {createNegation} from '../../../../../lib/parsing/predicates/negation_parsing'
import {createLiteral} from '../../../../../lib/parsing/values/literal'

const parser = createParameterlessParser(['e'])
const assertMatches = createAssertParameterlessPredicateParserMatches(parser)

describe('parseParameterlessPredicate can parse', () => {
    const getIdColumn = createGetColumn('e', 'id')
    const literalOne = createLiteral(1)

    describe('strict equalities with parentheses', () => {
        it('on the left side', () => {
            assertMatches(
                e => (e.id) === 1,
                createEqual(createInsideParentheses(getIdColumn), literalOne))
        })

        it('on the right side', () => {
            assertMatches(
                e => e.id === (1),
                createEqual(getIdColumn, createInsideParentheses(literalOne)))
        })

        it('on both sides', () => {
            assertMatches(
                e => (e.id) === (1),
                createEqual(createInsideParentheses(getIdColumn), createInsideParentheses(literalOne)))
        })

        describe('the entire comparison', () => {
            it('with no parentheses around the two sides', () => {
                assertMatches(
                    e => (e.id === 1),
                    createInsideParentheses(createEqual(getIdColumn, literalOne)))
            })

            it('and on the left side', () => {
                assertMatches(
                    e => ((e.id) === 1),
                    createInsideParentheses(createEqual(createInsideParentheses(getIdColumn), literalOne)))
            })

            it('and on the right side', () => {
                assertMatches(
                    e => (e.id === (1)),
                    createInsideParentheses(createEqual(getIdColumn, createInsideParentheses(literalOne))))
            })

            it('and on each side', () => {
                assertMatches(
                    e => ((e.id) === (1)),
                    createInsideParentheses(createEqual(createInsideParentheses(getIdColumn), createInsideParentheses(literalOne))))
            })

        })

        it('around parentheses', () => {
            assertMatches(
                e => ((e.id === 1)),
                createInsideParentheses(createInsideParentheses(createEqual(getIdColumn, literalOne))))
        })
    })

    describe('negations of strict equalities', () => {
        it('inside parentheses', () => {
            assertMatches(
                e => !(e.id === 1),
                createNegation(
                    createInsideParentheses(
                        createEqual(getIdColumn, literalOne)
                    )
                )
            )
        })

        it('inside parentheses inside parentheses', () => {
            assertMatches(
                e => !((e.id === 1)),
                createNegation(
                    createInsideParentheses(
                        createInsideParentheses(
                            createEqual(getIdColumn, literalOne)
                        )
                    )
                )
            )
        })
    })

    describe('double negations of strict equalities', () => {
        it('inside parentheses', () => {
            assertMatches(
                e => !!(e.id === 1),
                createInsideParentheses(
                    createEqual(getIdColumn, literalOne)
                )
            )
        })

        it('inside parentheses inside parentheses', () => {
            assertMatches(
                e => !!((e.id === 1)),
                createInsideParentheses(
                    createInsideParentheses(
                        createEqual(getIdColumn, literalOne)
                    )
                )
            )
        })
    })

})