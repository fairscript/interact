import {
    parsePredicateExpression,
    Predicate
} from '../../../lib/parsing/predicates/predicate_parsing'
import {extractLambdaParametersAndExpression} from '../../../lib/parsing/javascript/lambda_parsing'
import * as assert from 'assert'

export function createAssertParameterlessPredicateParserMatches(parser) {
    return (f: Function, expected: Predicate) => {
        const {parameters, expression} = extractLambdaParametersAndExpression(f)

        const actual = parsePredicateExpression(parser, expression)

        assert.deepEqual(actual, expected)
    }
}