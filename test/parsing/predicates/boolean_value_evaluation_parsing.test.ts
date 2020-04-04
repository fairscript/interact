import {
    createParameterizedBooleanValueEvaluationParser,
    createParameterlessBooleanValueEvaluationParser
} from '../../../lib/parsing/predicates/boolean_value_evaluation_parsing'
import {createGetColumn, createGetColumnParser} from '../../../lib/parsing/get_column_parsing'
import * as assert from 'assert'
import {createNegation} from '../../../lib/parsing/predicates/negation_parsing'
import {createConstant} from '../../../lib/parsing/predicates/side_parsing'
import {createGetProvided, createGetProvidedParser} from '../../../lib/parsing/get_provided_parsing'

const getColumnParser = createGetColumnParser(['e'])

describe('createParameterlessBooleanValueEvaluationParser creates a parser that', () => {
    const parser = createParameterlessBooleanValueEvaluationParser(getColumnParser)

    it('returns a GetColumn instance for e.fulltime', () => {
        assert.deepEqual(parser.run('e.fulltime').result, createGetColumn('e', 'fulltime'))
    })

    it('returns a Negation instance for !e.fulltime', () => {
        assert.deepEqual(parser.run('!e.fulltime').result, createNegation(createGetColumn('e', 'fulltime')))
    })

    describe('returns a Constant instance for', () => {
        it('true', () => {
            assert.deepEqual(parser.run('true').result, createConstant(true))
        })

        it('false', () => {
            assert.deepEqual(parser.run('false').result, createConstant(false))
        })
    })

    describe('returns a Negation instance for', () => {
        it('!true', () => {
            assert.deepEqual(parser.run('!true').result, createNegation(createConstant(true)))
        })

        it('!false', () => {
            assert.deepEqual(parser.run('!false').result, createNegation(createConstant(false)))
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