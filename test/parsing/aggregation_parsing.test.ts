import * as assert from 'assert'
import {
    createAggregate,
    createAggregation,
    createGetPartOfKey,
    parseAggregation
} from '../../lib/parsing/aggregation_parsing'
import {Employee} from '../test_tables'
import {createGetFromParameter} from '../../lib/column_operations'
import {AggregatableTable} from '../../lib/queries/one/aggregatable_table'
import {createKey, createPartOfKey} from '../../lib/parsing/get_key_parsing'

describe('parseAggregate', () => {
    const firstKeyColumn = createGetFromParameter('e', 'departmentId')
    const firstPartOfKey = createPartOfKey('departmentId', firstKeyColumn)

    const secondKeyColumn = createGetFromParameter('e', 'title')
    const secondPartOfKey = createPartOfKey('title', secondKeyColumn)

    const keyOfOnePart = createKey({e: 't1'}, [firstPartOfKey])
    const keyOfTwoParts = createKey({e: 't1'}, [firstPartOfKey, secondPartOfKey])

    describe('works for keys', () => {
        it('with one part', () => {
            assert.deepEqual(
                parseAggregation((key: {departmentId: string}) => ({ depId: key.departmentId }), keyOfOnePart),
                createAggregation(
                    {'departmentId': ['t1', 'departmentId']},
                    {},
                    [['depId', createGetPartOfKey('departmentId')]]
                )
            )    
        })

        describe('with two parts', () => {
            it('in one order', () => {
                assert.deepEqual(
                    parseAggregation((key: {departmentId: string, title: string}) => ({ depId: key.departmentId, title: key.title }), keyOfTwoParts),
                    createAggregation(
                        {departmentId: ['t1', 'departmentId'], title: ['t1', 'title']},
                        {},
                        [['depId', createGetPartOfKey('departmentId')], ['title', createGetPartOfKey('title')]]
                    )
                )
            })

            it('in reverse order', () => {
                assert.deepEqual(
                    parseAggregation((key: {departmentId: string, title: string}) => ({ title: key.title, depId: key.departmentId }), keyOfTwoParts),
                    createAggregation(
                        {departmentId: ['t1', 'departmentId'], title: ['t1', 'title']},
                        {},
                        [['title', createGetPartOfKey('title')], ['depId', createGetPartOfKey('departmentId')]]
                    )
                )
            })
        })
    })

    it('works for aggregation', () => {
        assert.deepEqual(
            parseAggregation((_, e: AggregatableTable<Employee>) => ({ highestSalary: e.salary.max() }), keyOfOnePart),
            createAggregation(
                {departmentId: ['t1', 'departmentId']},
                {e: 't1'},
                [['highestSalary', createAggregate('max', createGetFromParameter('e', 'salary'))]]
            )
        )
    })

    it('works for key access and aggregation combined', () => {
        assert.deepEqual(
            parseAggregation((key: {departmentId: string}, e: AggregatableTable<Employee>) => ({ depId: key.departmentId, highestSalary: e.salary.max() }), keyOfOnePart),
            createAggregation(
                {departmentId: ['t1', 'departmentId']},
                {e: 't1'},
                [
                    ['depId', createGetPartOfKey('departmentId')],
                    ['highestSalary', createAggregate('max', createGetFromParameter('e', 'salary'))]
                ]
            )
        )
    })
})