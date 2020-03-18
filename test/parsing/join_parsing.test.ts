import * as assert from 'assert'
import {Department, departments, Employee} from '../test_tables'
import {parseJoin} from '../../lib/parsing/join_parsing'
import {createGetFromParameter} from '../../lib/column_operations'

describe('parseJoin', () => {

    it('returns an object satisfying JoinExpression', () => {

        assert.deepEqual(
            parseJoin(
                'departments',
                (e: Employee) => e.departmentId,
                (d: Department) => d.id),
            {
                tableName: 'departments',
                left: createGetFromParameter('e', 'departmentId'),
                right: createGetFromParameter('d', 'id')
            })

    })

})