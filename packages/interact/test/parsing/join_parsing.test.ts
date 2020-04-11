import * as assert from 'assert'
import {createLeftSideOfJoin, createRightSideOfJoin, parseJoin} from '../../lib/parsing/join_parsing'
import {createGetColumn} from '../../lib/parsing/value_expressions/get_column_parsing'
import {Department, Employee} from '../../lib'

describe('parseJoin', () => {

    it('works for a join of two tables', () => {
        assert.deepEqual(
            parseJoin(
                'departments',
                (e: Employee) => e.departmentId,
                (d: Department) => d.id,
                1),
            {
                tableName: 'departments',
                left: createLeftSideOfJoin({'e': 't1'}, createGetColumn('e', 'departmentId')),
                right: createRightSideOfJoin('t2', createGetColumn('d', 'id'))
            })

    })

    describe('when the third table is joined on', () => {

        it('a column of the first table', () => {
            assert.deepEqual(
                parseJoin(
                    'companies',
                    (e, d) => e.companyId,
                    (c) => c.id,
                    2),
                {
                    tableName: 'companies',
                    left: createLeftSideOfJoin({'e': 't1', 'd': 't2'}, createGetColumn('e', 'companyId')),
                    right: createRightSideOfJoin('t3', createGetColumn('c', 'id'))
                })
        })

        it('a column of the second table', () => {
            assert.deepEqual(
                parseJoin(
                    'companies',
                    (e, d) => d.companyId,
                    (c) => c.id,
                    2),
                {
                    tableName: 'companies',
                    left: createLeftSideOfJoin({'e': 't1', 'd': 't2'}, createGetColumn('d', 'companyId')),
                    right: createRightSideOfJoin('t3', createGetColumn('c', 'id'))
                })
        })

    })

})