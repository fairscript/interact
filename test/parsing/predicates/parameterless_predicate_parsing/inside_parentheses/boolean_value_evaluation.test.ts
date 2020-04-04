import {
    createParameterlessParser,
    parseParameterlessPredicate
} from '../../../../../lib/parsing/predicates/predicate_parsing'
import {createAssertParameterlessPredicateParserMatches} from '../../predicate_assertion'
import {createEqual} from '../../../../../lib/parsing/predicates/comparisons'
import {createGetColumn} from '../../../../../lib/parsing/get_column_parsing'
import {createConstant, nullSingleton} from '../../../../../lib/parsing/predicates/side_parsing'
import {createInsideParentheses} from '../../../../../lib/parsing/predicates/inside_parentheses'
import {createNegation} from '../../../../../lib/parsing/predicates/negation_parsing'

const parser = createParameterlessParser(['e'])
const assertMatches = createAssertParameterlessPredicateParserMatches(parser)

describe('parseParameterlessPredicate can parse', () => {
    const getFullTimeColumn = createGetColumn('e', 'fulltime')
    const constantTrue = createConstant(true)
    const constantFalse = createConstant(false)

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
                    createInsideParentheses(createConstant(true))
                )
            })

            it('false', () => {
                assertMatches(
                    () => (false),
                    createInsideParentheses(createConstant(false))
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
                            constantTrue
                        ))
                )
            })

            it('false', () => {
                assertMatches(
                    () => (!false),
                    createInsideParentheses(
                        createNegation(
                            constantFalse
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
                    createInsideParentheses(constantTrue)
                )
            })

            it('false', () => {
                assertMatches(
                    () => (!!false),
                    createInsideParentheses(constantFalse)
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
                    createInsideParentheses(createInsideParentheses(createConstant(true)))
                )
            })

            it('false', () => {
                assertMatches(
                    () => ((false)),
                    createInsideParentheses(createInsideParentheses(createConstant(false)))
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
                                constantTrue
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
                                constantFalse
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
                    createInsideParentheses(createInsideParentheses(constantTrue))
                )
            })

            it('false', () => {
                assertMatches(
                    () => ((!!false)),
                    createInsideParentheses(createInsideParentheses(constantFalse))
                )
            })
        })
    })
})