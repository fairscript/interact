import {
    parseBooleanExpression,
    BooleanExpression
} from '../../../lib/parsing/boolean_expressions/boolean_expression_parsing'
import {extractLambdaParametersAndExpression} from '../../../lib/parsing/functions/lambda_parsing'
import * as assert from 'assert'

export function createAssertParameterlessBooleanExpressionParserMatches(parser) {
    return (f: Function, expected: BooleanExpression) => {
        const {parameters, expression} = extractLambdaParametersAndExpression(f)

        const actual = parseBooleanExpression(parser, expression)

        assert.deepEqual(actual, expected)
    }
}