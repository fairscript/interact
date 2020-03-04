import {escapeParenthesesInsideStrings} from '../../lib/parsing/parenthesis_parsing'
import * as assert from 'assert'

describe('escapeParenthesesInsideStrings', () => {

    describe('returns an empty array if the input text', () => {
        it('does not contain parentheses', () => {
            assert.deepEqual(escapeParenthesesInsideStrings('text'), [[], 'text'])
        })

        it('contains parentheses outside of strings', () => {
            assert.deepEqual(escapeParenthesesInsideStrings('(e.id == 1)'), [[], '(e.id == 1)'])
        })
    })

    it('escapes a parenthesis if it occurs inside a string', () => {
        assert.deepEqual(escapeParenthesesInsideStrings("'(test)'"), [[1, 6], "'OtestC'"])
        assert.deepEqual(escapeParenthesesInsideStrings("'other (test) other'"), [[7, 12], "'other OtestC other'"])

    })

    it('correctly identify strings', () => {
        // Subtract two because two characters are escaped
        assert.deepEqual(escapeParenthesesInsideStrings("'it\\\'s (inside) parentheses'"), [[9-2, 16-2], "'it\\\'s OinsideC parentheses'"])
    })

})