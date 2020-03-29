import * as assert from 'assert'
import {createCountParser, createCountRowsInGroup} from '../../../lib/parsing/aggregation/count_rows_in_group_parsing'
import {extractLambdaParametersAndExpression} from '../../../lib/parsing/javascript/lambda_parsing'
import {createAssertDoesNotMatch} from '../parsing_assertion'

describe('createCountParser creates a parser that', () => {
    const parser = createCountParser('count')
    const assertDoesNotMatch = createAssertDoesNotMatch(parser)

    it('matches the invocation of the COUNT function', () => {
        const {expression} = extractLambdaParametersAndExpression((key, e, count) => count())

        const actual = parser.run(expression).result
        const expected = createCountRowsInGroup()

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