import * as assert from 'assert'
import {aStringWithoutTheQuotes} from '../../../lib/parsing/values/string_parsing'

describe('aStringWithoutTheQuotes matches', () => {

    function check(input, expected) {
        assert.equal(aStringWithoutTheQuotes.run(input).result, expected)
    }

    it('single quote a quote and returns a', () => {
        check("'a'", 'a')
    })

    it('single quote ab quote and returns ab', () => {
        check("'ab'", 'ab')
    })

    it('text with an escaped single quote', () => {
        check("'I\\'m'", "I\\'m")
    })

    it('double quote a double quote and returns a', () => {
        check('"a"', 'a')
    })

    it('double quote ab double quote and returns ab', () => {
        check('"ab"', 'ab')
    })
})