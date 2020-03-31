import * as assert from 'assert'
import { createGroupAggregation, parseGroupAggregationSelection } from '../../../lib/parsing/selection/group_aggregation_selection_parsing'
import {Employee} from '../../test_tables'
import {AggregatableTable} from '../../../lib/queries/one/aggregatable_table'
import {createKey, createPartOfKey} from '../../../lib/parsing/get_key_parsing'
import {createGetPartOfKey} from '../../../lib/parsing/aggregation/get_part_of_key_parsing'
import {createCountOperation} from '../../../lib/parsing/count_operation_parsing'
import {createAggregateColumn} from '../../../lib/parsing/aggregation/aggregate_column_parsing'
import {createGetColumn} from '../../../lib/parsing/get_column_parsing'

describe('parseAggregate', () => {
    const firstKeyColumn = createGetColumn('e', 'departmentId')
    const firstPartOfKey = createPartOfKey('departmentId', firstKeyColumn)

    const secondKeyColumn = createGetColumn('e', 'title')
    const secondPartOfKey = createPartOfKey('title', secondKeyColumn)

    const keyOfOnePart = createKey({e: 't1'}, [firstPartOfKey])
    const keyOfTwoParts = createKey({e: 't1'}, [firstPartOfKey, secondPartOfKey])

    describe('returns one aliased GetPartOfKey object when the key is accessed', () => {
        it('with one part', () => {
            assert.deepEqual(
                parseGroupAggregationSelection((key: {departmentId: string}) => ({ depId: key.departmentId }), keyOfOnePart, 1),
                createGroupAggregation(
                    {'departmentId': ['t1', 'departmentId']},
                    {},
                    [['depId', createGetPartOfKey('departmentId')]]
                )
            )    
        })

        describe('returns two aliased GetPartOfKey objects when a key of two parts is accessed', () => {
            it('in one order', () => {
                assert.deepEqual(
                    parseGroupAggregationSelection((key: {departmentId: string, title: string}) => ({ depId: key.departmentId, title: key.title }), keyOfTwoParts, 1),
                    createGroupAggregation(
                        {departmentId: ['t1', 'departmentId'], title: ['t1', 'title']},
                        {},
                        [['depId', createGetPartOfKey('departmentId')], ['title', createGetPartOfKey('title')]]
                    )
                )
            })

            it('or in reverse order', () => {
                assert.deepEqual(
                    parseGroupAggregationSelection((key: {departmentId: string, title: string}) => ({ title: key.title, depId: key.departmentId }), keyOfTwoParts, 1),
                    createGroupAggregation(
                        {departmentId: ['t1', 'departmentId'], title: ['t1', 'title']},
                        {},
                        [['title', createGetPartOfKey('title')], ['depId', createGetPartOfKey('departmentId')]]
                    )
                )
            })
        })
    })

    it('returns an aliased AggregateColumn object when a column is aggregated', () => {
        assert.deepEqual(
            parseGroupAggregationSelection((_, e: AggregatableTable<Employee>) => ({ highestSalary: e.salary.max() }), keyOfOnePart, 1),
            createGroupAggregation(
                {departmentId: ['t1', 'departmentId']},
                {e: 't1'},
                [['highestSalary', createAggregateColumn('max', createGetColumn('e', 'salary'))]]
            )
        )
    })

    it('returns an aliased CountRowsInGroup object when the number of rows in each group is counted', () => {
        assert.deepEqual(
            parseGroupAggregationSelection((_, e: AggregatableTable<Employee>, count) => ({ employees: count()}), keyOfOnePart, 1),
            createGroupAggregation(
                {departmentId: ['t1', 'departmentId']},
                {e: 't1'},
                [['employees', createCountOperation()]]
            )
        )
    })

    it('can parse combinations of key access, column aggregation and row counting', () => {
        assert.deepEqual(
            parseGroupAggregationSelection((key: {departmentId: string}, e, count) => ({ depId: key.departmentId, highestSalary: e.salary.max(), employees: count() }), keyOfOnePart, 1),
            createGroupAggregation(
                {departmentId: ['t1', 'departmentId']},
                {e: 't1'},
                [
                    ['depId', createGetPartOfKey('departmentId')],
                    ['highestSalary', createAggregateColumn('max', createGetColumn('e', 'salary'))],
                    ['employees', createCountOperation()]
                ]
            )
        )
    })
})