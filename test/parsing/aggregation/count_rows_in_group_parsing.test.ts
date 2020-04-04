import * as assert from 'assert'
import {createCountOperationParser, createCountOperation} from '../../../lib/parsing/count_operation_parsing'
import {extractLambdaParametersAndExpression} from '../../../lib/parsing/javascript/lambda_parsing'
import {createAssertDoesNotMatchFunction} from '../parsing_assertion'

describe('createCountParser creates a parser that', () => {
    const parser = createCountOperationParser('count')
    const assertDoesNotMatch = createAssertDoesNotMatchFunction(parser)

    it('matches the invocation of the COUNT function', () => {
        const {expression} = extractLambdaParametersAndExpression((key, e, count) => count())

        const actual = parser.run(expression).result
        const expected = createCountOperation()

        assert.deepEqual(actual, expected)
    })

    describe('does not match', () => {
        it('the COUNT function', () => {
            assertDoesNotMatch((key, e, count) => count)
        })

        it('an object property', () => {
            assertDoesNotMatch((key, e, count) => e.salary)
        })

        it('the key', () => {
            assertDoesNotMatch((key, e, count) => key)
        })
    })

})