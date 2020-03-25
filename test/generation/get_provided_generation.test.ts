import * as assert from 'assert'
import {escapeUnderscore, generatePath} from '../../lib/generation/get_provided_generation'

describe('escapeUnderscore', () => {

    it('returns the same text when there are no underscores in the input', () => {
        assert.equal(
            escapeUnderscore('text'),
            'text')
    })

    it('replaces a single underscore with two underscores', () => {
        assert.equal(
            escapeUnderscore('_'),
            '__')
    })

    it('replaces two underscores with two underscores', () => {
        assert.equal(
            escapeUnderscore('__'),
            '____')
    })

})

describe('generatePath', () => {

    it('returns the first item unchanged when the path has only one item', () => {
        assert.equal(
            generatePath(['a']),
            'a')
    })

    it('joins parts with an underscore', () => {
        assert.equal(
            generatePath(['a', 'b']),
            'a_b')
    })

    it('escapes underscores', () => {
        assert.equal(
            generatePath(['a_b']),
            'a__b')
    })

})