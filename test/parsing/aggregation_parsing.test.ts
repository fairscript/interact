import * as assert from 'assert'
import {parseAggregation} from '../../lib/parsing/aggregation_parsing'
import {Employee} from '../test_tables'
import {createAccessKey, createAggregate, createAlias, createGet} from '../../lib/column_operations'
import {AggregatableTable} from '../../lib/queries/aggregate_table'

describe('parseAggregate', () => {
    it('works for key access', () => {
        assert.deepEqual(
            parseAggregation((key: {departmentId: string}) => ({ departmentId: key.departmentId })),
            [createAccessKey('departmentId', 'departmentId')]
        )
    })

    it('works for aggregation', () => {
        assert.deepEqual(
            parseAggregation((_, e: AggregatableTable<Employee>) => ({ maximumSalary: e.salary.max() })),
            [createAlias(createAggregate('max', createGet(1, 'salary')), 'maximumSalary')]
        )
    })

    it('works for key access and aggregation combined', () => {
        assert.deepEqual(
            parseAggregation((key: {departmentId: string}, e: AggregatableTable<Employee>) => ({ departmentId: key.departmentId, maximumSalary: e.salary.max() })),
            [createAccessKey('departmentId', 'departmentId'), createAlias(createAggregate('max', createGet(1, 'salary')), 'maximumSalary')]
        )
    })
})