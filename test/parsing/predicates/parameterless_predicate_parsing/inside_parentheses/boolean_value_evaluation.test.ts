import {
    createParameterlessParser,
    parseParameterlessPredicate
} from '../../../../../lib/parsing/boolean_expressions/boolean_expression_parsing'
import {createAssertParameterlessPredicateParserMatches} from '../../predicate_assertion'
import {createEqual} from '../../../../../lib/parsing/boolean_expressions/comparisons'
import {createGetColumn} from '../../../../../lib/parsing/value_expressions/get_column_parsing'
import {createInsideParentheses} from '../../../../../lib/parsing/boolean_expressions/inside_parentheses'
import {createNegation} from '../../../../../lib/parsing/boolean_expressions/negation_parsing'
import {createLiteral} from '../../../../../lib/parsing/values/literal'
import {nullSingleton} from '../../../../../lib/parsing/values/null'

const parser = createParameterlessParser(['e'])
const assertMatches = createAssertParameterlessPredicateParserMatches(parser)

describe('parseParameterlessPredicate can parse', () => {
    const getFullTimeColumn = createGetColumn('e', 'fulltime')
    const literalTrue = createLiteral(true)
    const literalFalse = createLiteral(false)

    describe('parentheses around', () => {
        describe('an evaluation of', () => {
            it('a column', () => {
                assertMatches(
                    e => (e.fulltime),
                    createInsideParentheses(getFullTimeColumn)
                )
            })

            it('true', () => {
                assertMatches(
                    () => (true),
                    createInsideParentheses(createLiteral(true))
                )
            })

            it('false', () => {
                assertMatches(
                    () => (false),
                    createInsideParentheses(createLiteral(false))
                )
            })
        })

        describe('a negated evaluation of', () => {
            it('a column', () => {
                assertMatches(
                    e => (!e.fulltime),
                    createInsideParentheses(
                        createNegation(
                            getFullTimeColumn
                        ))
                )
            })

            it('true', () => {
                assertMatches(
                    () => (!true),
                    createInsideParentheses(
                        createNegation(
                            literalTrue
                        ))
                )
            })

            it('false', () => {
                assertMatches(
                    () => (!false),
                    createInsideParentheses(
                        createNegation(
                            literalFalse
                        ))
                )
            })
        })

        describe('a double negation of an evaluation of', () => {
            it('a column', () => {
                assertMatches(
                    e => (!!e.fulltime),
                    createInsideParentheses(getFullTimeColumn)
                )
            })

            it('true', () => {
                assertMatches(
                    () => (!!true),
                    createInsideParentheses(literalTrue)
                )
            })

            it('false', () => {
                assertMatches(
                    () => (!!false),
                    createInsideParentheses(literalFalse)
                )
            })
        })
    })

    describe('double parentheses around', () => {
        describe('an evaluation of', () => {
            it('a column', () => {
                assertMatches(
                    e => ((e.fulltime)),
                    createInsideParentheses(createInsideParentheses(getFullTimeColumn))
                )
            })

            it('true', () => {
                assertMatches(
                    () => ((true)),
                    createInsideParentheses(createInsideParentheses(createLiteral(true)))
                )
            })

            it('false', () => {
                assertMatches(
                    () => ((false)),
                    createInsideParentheses(createInsideParentheses(createLiteral(false)))
                )
            })
        })

        describe('a negated evaluation of', () => {
            it('a column', () => {
                assertMatches(
                    e => ((!e.fulltime)),
                    createInsideParentheses(
                        createInsideParentheses(
                            createNegation(
                                getFullTimeColumn
                            )
                        )
                    )
                )
            })

            it('true', () => {
                assertMatches(
                    () => ((!true)),
                    createInsideParentheses(
                        createInsideParentheses(
                            createNegation(
                                literalTrue
                            )
                        )
                    )
                )
            })

            it('false', () => {
                assertMatches(
                    () => ((!false)),
                    createInsideParentheses(
                        createInsideParentheses(
                            createNegation(
                                literalFalse
                            )
                        )
                    )
                )
            })
        })

        describe('a double negation of an evaluation of', () => {
            it('a column', () => {
                assertMatches(
                    e => ((!!e.fulltime)),
                    createInsideParentheses(createInsideParentheses(getFullTimeColumn))
                )
            })

            it('true', () => {
                assertMatches(
                    () => ((!!true)),
                    createInsideParentheses(createInsideParentheses(literalTrue))
                )
            })

            it('false', () => {
                assertMatches(
                    () => ((!!false)),
                    createInsideParentheses(createInsideParentheses(literalFalse))
                )
            })
        })
    })
})