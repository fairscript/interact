import * as assert from 'assert'
import {parseAggregate} from '../../lib/parsing/aggregation_parsing'
import {createAccessKey, createAggregate, createAlias, createGet} from '../../lib/parsing/select_parsing'
import {Aggregatable} from '../../lib/queries/aggregate_table'
import {Employee} from '../test_tables'

describe('parseAggregate', () => {
    it('works for key access', () => {
        assert.deepEqual(
            parseAggregate((key: {departmentId: string}) => ({ departmentId: key.departmentId })),
            [createAccessKey('departmentId', 'departmentId')]
        )
    })

    it('works for aggregation', () => {
        assert.deepEqual(
            parseAggregate((_, e: Aggregatable<Employee>) => ({ maximumSalary: e.salary.max() })),
            [createAlias(createAggregate('max', createGet('e', 'salary')), 'maximumSalary')]
        )
    })

    it('works for key access and aggregation combined', () => {
        assert.deepEqual(
            parseAggregate((key: {departmentId: string}, e: Aggregatable<Employee>) => ({ departmentId: key.departmentId, maximumSalary: e.salary.max() })),
            [createAccessKey('departmentId', 'departmentId'), createAlias(createAggregate('max', createGet('e', 'salary')), 'maximumSalary')]
        )
    })
})