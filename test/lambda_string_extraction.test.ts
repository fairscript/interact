import {extractLambdaString} from '../lib/lambda_string_extraction'
import * as assert from 'assert'

describe('extractLambdaString', () => {

    it('extracts the parameter name for the identity function', () => {
        assert.equal(extractLambdaString(x => x), 'x')
    })

    describe('extracts the string including quotes for a constant function returning a string', () => {

        describe('surrounded by single quotes and', () => {
            it('without an escaped quote', () => {
                assert.equal(extractLambdaString(() => 'text'), "'text'")
            })

            it('with an escaped quote', () => {
                assert.equal(extractLambdaString(() => 'I\'m'), "'I\\'m'")
            })
        })

        describe('surrounded double quotes and', () => {
            it('without an escaped quote', () => {
                assert.equal(extractLambdaString(() => "text"), '"text"')
            })

            it('with an escaped quote', () => {
                assert.equal(extractLambdaString(() => "\"quote\""), '"\\"quote\\""')
            })
        })
    })
})
