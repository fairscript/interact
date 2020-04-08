import * as assert from 'assert'
import {Department, departments, Employee} from '../test_tables'
import {parseJoin} from '../../lib/parsing/join_parsing'
import {createGetColumn} from '../../lib/parsing/value_expressions/get_column_parsing'

describe('parseJoin', () => {

    it('works for a join of two tables', () => {
        assert.deepEqual(
            parseJoin(
                'departments',
                (e: Employee) => e.departmentId,
                (d: Department) => d.id),
            {
                tableName: 'departments',
                left: createGetColumn('e', 'departmentId'),
                right: createGetColumn('d', 'id')
            })

    })

    describe('when the third table is joined on', () => {

        it('a column of the first table', () => {
            assert.deepEqual(
                parseJoin(
                    'companies',
                    (e, d) => e.companyId,
                    (c) => c.id),
                {
                    tableName: 'companies',
                    left: createGetColumn('e', 'companyId'),
                    right: createGetColumn('c', 'id')
                })
        })

        it('a column of the first table', () => {
            assert.deepEqual(
                parseJoin(
                    'companies',
                    (e, d) => d.companyId,
                    (c) => c.id),
                {
                    tableName: 'companies',
                    left: createGetColumn('d', 'companyId'),
                    right: createGetColumn('c', 'id')
                })
        })

    })

})