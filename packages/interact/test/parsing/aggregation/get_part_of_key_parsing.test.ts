import * as assert from 'assert'
import {createCountOperationParser, createCountOperation} from '../../../lib/parsing/count_operation_parsing'
import {extractLambdaParametersAndExpression} from '../../../lib/parsing/functions/lambda_parsing'
import {createGetPartOfKey, createGetPartOfKeyParser} from '../../../lib/parsing/aggregation/get_part_of_key_parsing'
import {createAssertDoesNotMatchFunction} from '../parsing_assertion'

describe('createGetPartOfKeyParser creates a parser that', () => {
    const parser = createGetPartOfKeyParser('key')
    const assertDoesNotMatch = createAssertDoesNotMatchFunction(parser)

    it('matches parts of keys', () => {
        const {expression} = extractLambdaParametersAndExpression((key, e, count) => key.part)

        const actual = parser.run(expression).result
        const expected = createGetPartOfKey('part')

        assert.deepEqual(actual, expected)
    })

    describe('does not match', () => {
        it('the application of the COUNT function', () => {
            assertDoesNotMatch((key, e, count) => count())
        })

        it('the application of aggregation functions', () => {
            assertDoesNotMatch((key, e, count) => e.salary.max())
        })

        it('properties of other objects', () => {
            assertDoesNotMatch((key, e, count) => e.salary)
        })

        it('the key', () => {
            assertDoesNotMatch((key, e, count) => key)
        })
    })

})