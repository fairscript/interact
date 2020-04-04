import * as assert from 'assert'
import {
    createParameterlessValueExpressionParser
} from '../../../lib/parsing/valuexpressions/value_expression_parsing'
import {createGetColumn, createGetColumnParser} from '../../../lib/parsing/valuexpressions/get_column_parsing'
import {createLiteral} from '../../../lib/parsing/values/literal'
import {nullSingleton} from '../../../lib/parsing/values/null'

describe('createParameterlessValueExpressionParser returns a parser that', () => {
    const parser = createParameterlessValueExpressionParser(createGetColumnParser(['e']))

    describe('returns an object satisfying the Literal interface', () => {
        it('when the input is a number', () => {
            assert.deepEqual(parser.run('1').result, createLiteral(1))
        })

        it('when the input is null', () => {
            assert.deepEqual(parser.run('null').result, nullSingleton)
        })

        it('when the input is a string', () => {
            assert.deepEqual(parser.run("'text'").result, createLiteral('text'))
        })

        it('when the input is a boolean', () => {
            assert.deepEqual(parser.run("true").result, createLiteral(true))
            assert.deepEqual(parser.run("false").result, createLiteral(false))
        })
    })

    describe('returns a GetColumn instance', () => {
        it('when an object property is accessed', () => {
            assert.deepEqual(parser.run('e.salary').result, createGetColumn('e', 'salary'))
        })
    })
})