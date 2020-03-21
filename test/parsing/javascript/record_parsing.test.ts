import * as assert from 'assert'
import * as A from 'arcsecond'
import {
    createKeyValueArrayParser,
    createKeyValuePairParser,
    createRecordInParenthesesParser,
    createRecordParser
} from '../../../lib/parsing/javascript/record_parsing'

const someValueParser = A.str('some value')

describe('createKeyValuePairParser', () => {
    it('creates a parser that returns [identifier, value] for "identifier: value"', () => {
        assert.deepEqual(
            createKeyValuePairParser(someValueParser).run('someKey: some value').result,
            ['someKey', 'some value'])
    })
})

describe('createKeyValueArrayParser', () => {
    it('creates a parser that returns [[identifier, value]] for "identifier: value"', () => {
        assert.deepEqual(
            createKeyValueArrayParser(someValueParser).run('someKey: some value').result,
            [['someKey', 'some value']])
    })

    it('creates a parser that returns [[identifier1, value1], [identifier2, value2]] for "identifier1: value1, identifier2: value2"', () => {
        assert.deepEqual(
            createKeyValueArrayParser(someValueParser).run('firstKey: some value, secondKey: some value').result,
            [['firstKey', 'some value'], ['secondKey', 'some value']])
    })
})

describe('createRecordParser', () => {
    it('creates a parser that returns [[identifier, value]] for "{identifier: value}"', () => {
        assert.deepEqual(
            createRecordParser(someValueParser).run('{someKey: some value}').result,
            [['someKey', 'some value']])
    })

    it('creates a parser that returns [[identifier1, value1], [identifier2, value2]] for "{identifier1: value1, identifer2: value2}"', () => {
        assert.deepEqual(
            createRecordParser(someValueParser).run('{firstKey: some value, secondKey: some value}').result,
            [['firstKey', 'some value'], ['secondKey', 'some value']])
    })
})

describe('createRecordParserInParentheses', () => {
    it('creates a parser that returns [[identifier, value]] for "({identifier: value})"', () => {
        assert.deepEqual(
            createRecordInParenthesesParser(someValueParser).run('({someKey: some value})').result,
            [['someKey', 'some value']])
    })

    it('creates a parser that returns [[identifier1, value1], [identifier2, value2]] for "({identifier1: value1, identifier2: value2})"', () => {
        assert.deepEqual(
            createRecordInParenthesesParser(someValueParser).run('({firstKey: some value, secondKey: some value})').result,
            [['firstKey', 'some value'], ['secondKey', 'some value']])
    })
})