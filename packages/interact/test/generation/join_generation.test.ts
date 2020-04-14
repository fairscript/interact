import * as assert from 'assert'
import {generateInnerJoin} from '../../lib/generation/join_generation'
import {createGetColumn} from '../../lib/parsing/value_expressions/get_column_parsing'
import {createLeftSideOfJoin, createRightSideOfJoin} from '../../lib/parsing/join_parsing'

describe('generateInnerJoin', () => {
    it('works when two tables are joined', () => {
        assert.equal(
            generateInnerJoin(
                'departments',
                createLeftSideOfJoin({e: 't1'}, createGetColumn('e', 'departmentId')),
                createRightSideOfJoin('t2', createGetColumn('d', 'id'))
            ),
            'INNER JOIN departments t2 ON t1.department_id = t2.id'
        )
    })
})