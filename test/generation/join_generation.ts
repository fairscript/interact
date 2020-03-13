import * as assert from 'assert'
import {generateInnerJoin} from '../../lib/generation/join_generation'
import {createGet} from '../../lib/column_operations'

describe('generateInnerJoin', () => {
    it('works when two tables are joined', () => {
        assert.equal(
            generateInnerJoin([{
                tableName: 'departments',
                left: createGet(1, 'departmentId'),
                right: createGet(2, 'id')
            }]),
            'INNER JOIN departments t2 ON t1.department_id = t2.id'
        )
    })
})