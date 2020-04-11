import normalizeQuotes from '../../lib/parsing/quote_normalization'
import * as assert from 'assert'

describe('normalizeQuotes', () => {

    describe('return the input if', () => {

        it('it does not contain any quotes', () => {
            assert.equal(normalizeQuotes('text'), 'text')
        })

        it('it does contain single quotes only', () => {
            assert.equal(normalizeQuotes("'text'"), "'text'")
        })
    })

    describe('replaces double quotes with singles quotes when', () => {
        it('they surround a string', () => {
            assert.equal(normalizeQuotes('"text"'), "'text'")
        })

        it('they surround two string', () => {
            assert.equal(normalizeQuotes('"text1" "text2"'), "'text1' 'text2'")
        })
    })

    it('doesn\'t replace double quotes when they are inside a string surrounded by single quotes', () => {
        assert.equal(normalizeQuotes("'\"text\"'"), "'\"text\"'")
    })
})