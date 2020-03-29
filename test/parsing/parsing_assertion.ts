import * as assert from 'assert'
import {extractLambdaParametersAndExpression} from '../../lib/parsing/javascript/lambda_parsing'

export function createAssertDoesNotMatch(parser) {
    return (f: Function) => {
        const {expression} = extractLambdaParametersAndExpression(f)

        assert.equal(parser.run(expression).isError, true)
    }
}