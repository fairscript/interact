import * as assert from 'assert'
import {
    createParameterlessValueExpressionParser, literalValueExpressionParser
} from '../../../lib/parsing/value_expressions/value_expression_parsing'
import {createGetColumn, createGetColumnParser} from '../../../lib/parsing/value_expressions/get_column_parsing'
import {createLiteral} from '../../../lib/parsing/literals/literal'
import {nullSingleton} from '../../../lib/parsing/literals/null'

describe('literalValueExpressionParser', function () {
    describe('returns an object satisfying the Literal interface', () => {
        it('when the input is a number', () => {
            assert.deepEqual(literalValueExpressionParser.run('1').result, createLiteral(1))
        })

        it('when the input is null', () => {
            assert.deepEqual(literalValueExpressionParser.run('null').result, nullSingleton)
        })

        it('when the input is a string', () => {
            assert.deepEqual(literalValueExpressionParser.run("'text'").result, createLiteral('text'))
        })

        it('when the input is a boolean', () => {
            assert.deepEqual(literalValueExpressionParser.run("true").result, createLiteral(true))
            assert.deepEqual(literalValueExpressionParser.run("false").result, createLiteral(false))
        })
    })
})

describe('createParameterlessValueExpressionParser returns a parser that', () => {
    const parser = createParameterlessValueExpressionParser(createGetColumnParser(['e']))

    describe('returns a GetColumn instance', () => {
        it('when an object property is accessed', () => {
            assert.deepEqual(parser.run('e.salary').result, createGetColumn('e', 'salary'))
        })
    })
})