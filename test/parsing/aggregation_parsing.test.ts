import * as assert from 'assert'
import {
    createAggregateColumn,
    createAggregation, createCountRowsInGroup,
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

    describe('returns one aliased GetPartOfKey object when the key is accessed', () => {
        it('with one part', () => {
            assert.deepEqual(
                parseAggregation((key: {departmentId: string}) => ({ depId: key.departmentId }), keyOfOnePart, 1),
                createAggregation(
                    {'departmentId': ['t1', 'departmentId']},
                    {},
                    [['depId', createGetPartOfKey('departmentId')]]
                )
            )    
        })

        describe('returns two aliased GetPartOfKey objects when a key of two parts is accessed', () => {
            it('in one order', () => {
                assert.deepEqual(
                    parseAggregation((key: {departmentId: string, title: string}) => ({ depId: key.departmentId, title: key.title }), keyOfTwoParts, 1),
                    createAggregation(
                        {departmentId: ['t1', 'departmentId'], title: ['t1', 'title']},
                        {},
                        [['depId', createGetPartOfKey('departmentId')], ['title', createGetPartOfKey('title')]]
                    )
                )
            })

            it('or in reverse order', () => {
                assert.deepEqual(
                    parseAggregation((key: {departmentId: string, title: string}) => ({ title: key.title, depId: key.departmentId }), keyOfTwoParts, 1),
                    createAggregation(
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
            parseAggregation((_, e: AggregatableTable<Employee>) => ({ highestSalary: e.salary.max() }), keyOfOnePart, 1),
            createAggregation(
                {departmentId: ['t1', 'departmentId']},
                {e: 't1'},
                [['highestSalary', createAggregateColumn('max', createGetFromParameter('e', 'salary'))]]
            )
        )
    })

    it('returns an aliased CountRowsInGroup object when the number of rows in each group is counted', () => {
        assert.deepEqual(
            parseAggregation((_, e: AggregatableTable<Employee>, count) => ({ employees: count()}), keyOfOnePart, 1),
            createAggregation(
                {departmentId: ['t1', 'departmentId']},
                {e: 't1'},
                [['employees', createCountRowsInGroup()]]
            )
        )
    })

    it('can parse combinations of key access, column aggregation and row counting', () => {
        assert.deepEqual(
            parseAggregation((key: {departmentId: string}, e, count) => ({ depId: key.departmentId, highestSalary: e.salary.max(), employees: count() }), keyOfOnePart, 1),
            createAggregation(
                {departmentId: ['t1', 'departmentId']},
                {e: 't1'},
                [
                    ['depId', createGetPartOfKey('departmentId')],
                    ['highestSalary', createAggregateColumn('max', createGetFromParameter('e', 'salary'))],
                    ['employees', createCountRowsInGroup()]
                ]
            )
        )
    })
})