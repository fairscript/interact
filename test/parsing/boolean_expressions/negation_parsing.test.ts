import {aBoolean} from '../../../lib/parsing/literals/boolean_parsing'
import {createNegation, createNegationParser} from '../../../lib/parsing/boolean_expressions/negation_parsing'
import {createAssertDoesNotMatchExpression} from '../parsing_assertion'
import * as assert from 'assert'
import {createGetColumn, createGetColumnParser} from '../../../lib/parsing/value_expressions/get_column_parsing'
import {createLiteral} from '../../../lib/parsing/literals/literal'

describe('createNegationParser returns a parser', () => {

    describe('for aBoolean.map(createLiteral) as input', () => {
        const parser = createNegationParser(aBoolean.map(createLiteral))
        const assertDoesNotMatch = createAssertDoesNotMatchExpression(parser)

        describe('which does not match', () => {
            it('true', () => {
                assertDoesNotMatch('true')
            })

            it('false', () => {
                assertDoesNotMatch('false')
            })
        })

        describe('which returns an instance of Negation for', () => {
            it('!true', () => {
                assert.deepEqual(parser.run('!true').result, createNegation(createLiteral(true)))
            })

            it('!false', () => {
                assert.deepEqual(parser.run('!false').result, createNegation(createLiteral(false)))
            })
        })

        describe('which returns the result of the inner parser for', () => {
            it('!!true', () => {
                assert.deepEqual(parser.run('!!true').result, createLiteral(true))
            })

            it('!!false', () => {
                assert.deepEqual(parser.run('!!false').result, createLiteral(false))
            })
        })
    })

    describe('for a GetColumn parser as input', () => {
        const parser = createNegationParser(createGetColumnParser(['e']))
        const assertDoesNotMatch = createAssertDoesNotMatchExpression(parser)

        describe('which does not match', () => {
            it('e.fulltime', () => {
                assertDoesNotMatch('e.fulltime')
            })
        })

        describe('which returns an instance of Negation for', () => {
            it('!e.fulltime', () => {
                assert.deepEqual(parser.run('!e.fulltime').result, createNegation(createGetColumn('e', 'fulltime')))
            })
        })

        describe('which returns the result of the inner parser for', () => {
            it('!!e.fulltime', () => {
                assert.deepEqual(parser.run('!!e.fulltime').result, createGetColumn('e', 'fulltime'))
            })
        })
    })

})