import * as assert from 'assert'
import {extractLambdaParametersAndExpression} from '../../../lib/parsing/functions/lambda_parsing'

describe('extractLambdaParametersAndExpression', () => {

    it('can parse functions with no parameters', () => {
        const input = function() { return 1; }

        assert.deepEqual(
            extractLambdaParametersAndExpression(input),
            {
                parameters: [],
                expression: '1'
            }
        )
    })

    it('can parse functions with one parameter', () => {
        const input = function(a) { return 1; }

        assert.deepEqual(
            extractLambdaParametersAndExpression(input),
            {
                parameters: ['a'],
                expression: '1'
            }
        )
    })

    it('can parse functions with two parameters', () => {
        const input = function(a, b) { return 1; }

        assert.deepEqual(
            extractLambdaParametersAndExpression(input),
            {
                parameters: ['a', 'b'],
                expression: '1'
            }
        )
    })

})