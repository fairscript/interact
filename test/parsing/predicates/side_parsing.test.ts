import * as assert from 'assert'
import {
    createConstant,
    createParameterlessSideParser, nullSingleton
} from '../../../lib/parsing/predicates/side_parsing'
import {createGetColumn, createGetColumnParser} from '../../../lib/parsing/get_column_parsing'

describe('createParameterlessSideParser returns a parser that', () => {
    const parser = createParameterlessSideParser(createGetColumnParser(['e']))

    describe('returns a Constant instance', () => {
        it('when the input is a number', () => {
            assert.deepEqual(parser.run('1').result, createConstant(1))
        })

        it('when the input is null', () => {
            assert.deepEqual(parser.run('null').result, nullSingleton)
        })

        it('when the input is a string', () => {
            assert.deepEqual(parser.run("'text'").result, createConstant('text'))
        })

        it('when the input is a boolean', () => {
            assert.deepEqual(parser.run("true").result, createConstant(true))
            assert.deepEqual(parser.run("false").result, createConstant(false))
        })
    })

    describe('returns a GetColumn instance', () => {
        it('when an object property is accessed', () => {
            assert.deepEqual(parser.run('e.salary').result, createGetColumn('e', 'salary'))
        })
    })
})