import * as assert from 'assert'
import * as A from 'arcsecond'
import {
    createNestedObjectPropertyParser,
    createKeyValueArrayParser,
    createKeyValuePairParser, createObjectPropertyParser,
    createRecordInParenthesesParser,
    createRecordParser
} from '../../../lib/parsing/literals/record_parsing'
import {identifier} from '../../../lib/parsing/identifier_parsing'

const someValueParser = A.str('some value')

describe('createObjectPropertyParser', () => {
    it('creates a parser that matches identifier.identifier', () => {
        assert.deepEqual(
            createObjectPropertyParser(identifier, identifier).run('object.property').result,
            ['object', 'property'])
    })
})

describe('createNestedObjectPropertyParser creates a parser', () => {
    const nestedObjectPropertyParser = createNestedObjectPropertyParser(identifier, identifier)

    it('that can match a property on the first level', () => {
        assert.deepEqual(
            nestedObjectPropertyParser.run('object.first').result,
            ['object', ['first']])
    })

    it('that can match a property on the second level', () => {
        assert.deepEqual(
            nestedObjectPropertyParser.run('object.first.second').result,
            ['object', ['first', 'second']])
    })

    it('that can match a property on the third level', () => {
        assert.deepEqual(
            nestedObjectPropertyParser.run('object.first.second.third').result,
            ['object', ['first', 'second', 'third']])
    })
})

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