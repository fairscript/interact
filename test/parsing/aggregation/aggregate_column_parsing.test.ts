import * as assert from 'assert'
import {extractLambdaParametersAndExpression} from '../../../lib/parsing/javascript/lambda_parsing'
import {
    AggregateColumn,
    createAggregateColumn,
    createAggregateColumnParser
} from '../../../lib/parsing/aggregation/aggregate_column_parsing'
import {createGetColumn} from '../../../lib/column_operations'
import {createAssertDoesNotMatch} from '../parsing_assertion'

describe('createAggregateColumnParser creates a parser that', () => {
    const parser = createAggregateColumnParser(['e'])
    const assertDoesNotMatch = createAssertDoesNotMatch(parser)

    function assertMatches(f: Function, expected: AggregateColumn) {
        const {expression} = extractLambdaParametersAndExpression(f)

        const actual = parser.run(expression).result

        assert.deepEqual(actual, expected)
    }

    describe('matches the application of', () => {
        it('the MAX aggregation function', () => {
            assertMatches(
                (key, e, count) => e.salary.max(),
                createAggregateColumn('max', createGetColumn('e', 'salary'))
            )
        })

        it('the MIN aggregation function', () => {
            assertMatches(
                (key, e, count) => e.salary.min(),
                createAggregateColumn('min', createGetColumn('e', 'salary'))
            )
        })

        it('the AVG aggregation function', () => {
            assertMatches(
                (key, e, count) => e.salary.avg(),
                createAggregateColumn('avg', createGetColumn('e', 'salary'))
            )
        })

        it('the SUM aggregation function', () => {
            assertMatches(
                (key, e, count) => e.salary.sum(),
                createAggregateColumn('sum', createGetColumn('e', 'salary'))
            )
        })
    })

    describe('does not match', () => {
        it('the application of the COUNT(*) function', () => {
            assertDoesNotMatch((key, e, count) => count())
        })

        it('the key', () => {
            assertDoesNotMatch((key, e, count) => key)
        })

        it('object properties', () => {
            assertDoesNotMatch((key, e, count) => e.salary)
        })
    })

})