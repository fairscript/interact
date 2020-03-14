import * as assert from 'assert'
import {parseAggregation} from '../../lib/parsing/aggregation_parsing'
import {Employee} from '../test_tables'
import {createAggregate, createAlias, createGet} from '../../lib/column_operations'
import {AggregatableTable} from '../../lib/queries/one/aggregate_table'
import {createPartOfKey} from '../../lib/parsing/get_key_parsing'

describe('parseAggregate', () => {
    const firstKeyColumn = createGet(1, 'departmentId')
    const firstPartOfKey = createPartOfKey(firstKeyColumn, 'departmentId')

    const secondKeyColumn = createGet(1, 'title')
    const secondPartOfKey = createPartOfKey(secondKeyColumn, 'title')

    const keyOfOnePart = [firstPartOfKey]
    const keyOfTwoParts = [firstPartOfKey, secondPartOfKey]

    describe('works for keys', () => {
        it('with one part', () => {
            assert.deepEqual(
                parseAggregation((key: {departmentId: string}) => ({ depId: key.departmentId }), keyOfOnePart),
                [createAlias(firstKeyColumn, 'depId')]
            )    
        })

        describe('with two parts', () => {
            it('in one order', () => {
                assert.deepEqual(
                    parseAggregation((key: {departmentId: string, title: string}) => ({ depId: key.departmentId, title: key.title }), keyOfTwoParts),
                    [createAlias(firstKeyColumn, 'depId'), createAlias(secondKeyColumn, 'title')]
                )
            })

            it('in reverse order', () => {
                assert.deepEqual(
                    parseAggregation((key: {departmentId: string, title: string}) => ({ title: key.title, depId: key.departmentId }), keyOfTwoParts),
                    [createAlias(secondKeyColumn, 'title'), createAlias(firstKeyColumn, 'depId')]
                )
            })
        })
    })

    it('works for aggregation', () => {
        assert.deepEqual(
            parseAggregation((_, e: AggregatableTable<Employee>) => ({ maximumSalary: e.salary.max() }), keyOfOnePart),
            [createAlias(createAggregate('max', createGet(1, 'salary')), 'maximumSalary')]
        )
    })

    it('works for key access and aggregation combined', () => {
        assert.deepEqual(
            parseAggregation((key: {departmentId: string}, e: AggregatableTable<Employee>) => ({ departmentId: key.departmentId, maximumSalary: e.salary.max() }), keyOfOnePart),
            [createAlias(firstKeyColumn, 'departmentId'), createAlias(createAggregate('max', createGet(1, 'salary')), 'maximumSalary')]
        )
    })
})