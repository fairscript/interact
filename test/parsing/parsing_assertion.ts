import * as assert from 'assert'
import {extractLambdaParametersAndExpression} from '../../lib/parsing/functions/lambda_parsing'

export function createAssertDoesNotMatchExpression(parser) {
    return expression => {
        assert.equal(parser.run(expression).isError, true)
    }
}

export function createAssertDoesNotMatchFunction(parser) {
    const assertDoesNotMatchExpression = createAssertDoesNotMatchExpression(parser)

    return (f: Function) => {
        const {expression} = extractLambdaParametersAndExpression(f)

        assertDoesNotMatchExpression(expression)
    }
}