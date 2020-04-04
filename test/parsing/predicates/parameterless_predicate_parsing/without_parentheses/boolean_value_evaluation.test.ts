import {
    createParameterlessParser,
    parseParameterlessPredicate
} from '../../../../../lib/parsing/predicates/predicate_parsing'
import {createAssertParameterlessPredicateParserMatches} from '../../predicate_assertion'
import {createEqual} from '../../../../../lib/parsing/predicates/comparisons'
import {createGetColumn} from '../../../../../lib/parsing/get_column_parsing'
import {createNegation} from '../../../../../lib/parsing/predicates/negation_parsing'
import {createLiteral} from '../../../../../lib/parsing/values/literal'
import {nullSingleton} from '../../../../../lib/parsing/values/null'

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
                createLiteral(true))
        })

        it('false', () => {
            assertMatches(
                () => false,
                createLiteral(false))
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
                    createLiteral(true)
                )
            )
        })

        it('false', () => {
            assertMatches(
                () => !false,
                createNegation(
                    createLiteral(false)
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
                createLiteral(true)
            )
        })

        it('false', () => {
            assertMatches(
                () => !!false,
                createLiteral(false)
            )
        })
    })

})