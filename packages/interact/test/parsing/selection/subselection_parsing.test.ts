import * as assert from 'assert'
import {createSubselectParser} from '../../../lib/parsing/selection/subselection_parsing'
import {AggregationFunction, createAggregateColumn} from '../../../lib/parsing/aggregation/aggregate_column_parsing'
import {extractLambdaParametersAndExpression} from '../../../lib/parsing/functions/lambda_parsing'
import {createCountSelection} from '../../../lib/parsing/selection/count_selection'
import {createSingleColumnSelection} from '../../../lib/parsing/selection/single_column_selection_parsing'
import {createGetColumn} from '../../../lib/parsing/value_expressions/get_column_parsing'

describe('createSubselectParser', () => {

    it('matches subtable.count()', () => {
        const parser = createSubselectParser(['st'], ['t'])

        const actual = parser.run('st.count()').result

        assert.deepEqual(
            actual,
            [
                'st',
                [],
                createCountSelection()
            ]
        )
    })

    describe('matches single column aggregation with', () => {
        function checkAggregationFunction(subselection: Function, aggregationFunction:AggregationFunction) {
            const {expression} = extractLambdaParametersAndExpression(subselection)

            const parser = createSubselectParser(['st'], ['t'])

            const actual = parser.run(expression).result

            assert.deepEqual(
                actual,
                [
                    'st',
                    [],
                    createSingleColumnSelection(
                        {'se': 's1'},
                        createAggregateColumn(aggregationFunction, createGetColumn('se', 'salary'))
                    )

                ]
            )
        }

        it('the MAX function', () => {
            checkAggregationFunction(st => st.max(se => se.salary), 'max')
        })

        it('the MIN function', () => {
            checkAggregationFunction(st => st.min(se => se.salary), 'min')
        })

        it('the AVG function', () => {
            checkAggregationFunction(st => st.average(se => se.salary), 'avg')
        })

        it('the SUM function', () => {
            checkAggregationFunction(st => st.sum(se => se.salary), 'sum')
        })
    })

})