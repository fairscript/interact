import * as assert from 'assert'
import {parseLambdaFunction} from '../../lib/parsing/lambda_parsing'

describe('parseLambdaFunction', () => {

    it('can parse functions with no parameters', () => {
        const input = function() { return 1; }

        assert.deepEqual(
            parseLambdaFunction(input),
            {
                parameters: [],
                expression: '1'
            }
        )
    })

    it('can parse functions with one parameter', () => {
        const input = function(a) { return 1; }

        assert.deepEqual(
            parseLambdaFunction(input),
            {
                parameters: ['a'],
                expression: '1'
            }
        )
    })

    it('can parse functions with two parameters', () => {
        const input = function(a, b) { return 1; }

        assert.deepEqual(
            parseLambdaFunction(input),
            {
                parameters: ['a', 'b'],
                expression: '1'
            }
        )
    })

})