import {
    createParameterizedBooleanValueEvaluationParser,
    createParameterlessBooleanValueEvaluationParser
} from '../../../lib/parsing/boolean_expressions/boolean_value_evaluation_parsing'
import {createGetColumn, createGetColumnParser} from '../../../lib/parsing/value_expressions/get_column_parsing'
import * as assert from 'assert'
import {createNegation} from '../../../lib/parsing/boolean_expressions/negation_parsing'
import {createGetProvided, createGetProvidedParser} from '../../../lib/parsing/value_expressions/get_provided_parsing'
import {createLiteral} from '../../../lib/parsing/values/literal'

const getColumnParser = createGetColumnParser(['e'])

describe('createParameterlessBooleanValueEvaluationParser creates a parser that', () => {
    const parser = createParameterlessBooleanValueEvaluationParser(getColumnParser)

    it('returns a GetColumn instance for e.fulltime', () => {
        assert.deepEqual(parser.run('e.fulltime').result, createGetColumn('e', 'fulltime'))
    })

    it('returns a Negation instance for !e.fulltime', () => {
        assert.deepEqual(parser.run('!e.fulltime').result, createNegation(createGetColumn('e', 'fulltime')))
    })

    describe('returns an object satisfying the Literal interface for', () => {
        it('true', () => {
            assert.deepEqual(parser.run('true').result, createLiteral(true))
        })

        it('false', () => {
            assert.deepEqual(parser.run('false').result, createLiteral(false))
        })
    })

    describe('returns a Negation instance for', () => {
        it('!true', () => {
            assert.deepEqual(parser.run('!true').result, createNegation(createLiteral(true)))
        })

        it('!false', () => {
            assert.deepEqual(parser.run('!false').result, createNegation(createLiteral(false)))
        })
    })

})

describe('createParameterizedBooleanValueEvaluationParser creates a parser that', () => {
    const prefix = 'f1'
    const userProvidedParameter = 'p'

    const parser = createParameterizedBooleanValueEvaluationParser(createGetProvidedParser(prefix, userProvidedParameter), getColumnParser)

    describe('returns a GetProvided instance for', () => {
        it('p.fulltime', () => {
            assert.deepEqual(parser.run('p.fulltime').result, createGetProvided(prefix, userProvidedParameter, ['fulltime']))
        })

        it('!!p.fulltime', () => {
            assert.deepEqual(parser.run('!!p.fulltime').result, createGetProvided(prefix, userProvidedParameter, ['fulltime']))
        })
    })

    it('returns a Negation instance that contains a GetProvided instance for !p.fulltime', () => {
        assert.deepEqual(parser.run('!p.fulltime').result, createNegation(createGetProvided(prefix, userProvidedParameter, ['fulltime'])))
    })
})