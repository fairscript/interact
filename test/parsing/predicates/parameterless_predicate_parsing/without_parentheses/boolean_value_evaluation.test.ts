import {
    createParameterlessParser,
    parseParameterlessPredicate
} from '../../../../../lib/parsing/predicates/predicate_parsing'
import {createAssertParameterlessPredicateParserMatches} from '../../predicate_assertion'
import {createEqual} from '../../../../../lib/parsing/predicates/comparisons'
import {createGetColumn} from '../../../../../lib/parsing/get_column_parsing'
import {createConstant, nullSingleton} from '../../../../../lib/parsing/predicates/side_parsing'
import {createNegation} from '../../../../../lib/parsing/predicates/negation_parsing'

const parser = createParameterlessParser(['e'])
const assertMatches = createAssertParameterlessPredicateParserMatches(parser)

describe('parseParameterlessPredicate can parse', () => {

    describe('evaluation of', () => {
        it('a column', () => {
            assertMatches(
                e => e.fulltime,
                createGetColumn('e', 'fulltime'))
        })

        it('true', () => {
            assertMatches(
                () => true,
                createConstant(true))
        })

        it('false', () => {
            assertMatches(
                () => false,
                createConstant(false))
        })
    })

    describe('a negated evaluation of', () => {
        it('a column', () => {
            assertMatches(
                e => !e.fulltime,
                createNegation(
                    createGetColumn('e', 'fulltime')
                )
            )
        })

        it('true', () => {
            assertMatches(
                () => !true,
                createNegation(
                    createConstant(true)
                )
            )
        })

        it('false', () => {
            assertMatches(
                () => !false,
                createNegation(
                    createConstant(false)
                ))
        })
    })

    describe('a double negation of', () => {
        it('a column', () => {
            assertMatches(
                e => !!e.fulltime,
                createGetColumn('e', 'fulltime')
            )
        })

        it('true', () => {
            assertMatches(
                () => !!true,
                createConstant(true)
            )
        })

        it('false', () => {
            assertMatches(
                () => !!false,
                createConstant(false)
            )
        })
    })

})