import * as assert from 'assert'
import {generateInnerJoin} from '../../lib/generation/join_generation'
import {createGetColumn} from '../../lib/parsing/get_column_parsing'

describe('generateInnerJoin', () => {
    it('works when two tables are joined', () => {
        assert.equal(
            generateInnerJoin({
                tableName: 'departments',
                left: createGetColumn('e', 'departmentId'),
                right: createGetColumn('d', 'id')
            }),
            'INNER JOIN departments t2 ON t1.department_id = t2.id'
        )
    })
})