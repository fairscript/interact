import * as assert from 'assert'
import {Department, departments, Employee} from '../test_tables'
import {parseJoin} from '../../lib/parsing/join_parsing'
import {createGetColumn} from '../../lib/parsing/value_expressions/get_column_parsing'

describe('parseJoin', () => {

    it('returns an object satisfying JoinExpression', () => {

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

})