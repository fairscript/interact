import * as assert from 'assert'
import {
    createSingleTableSelection,
    parseSingleTableSelection
} from '../../../lib/parsing/selection/single_table_selection_parsing'
import {employees} from '../../../lib/test/test_tables'

describe('parseSelectSingleTable', () => {
    it('returns an array of objects satisfying the Get interface', () => {
        assert.deepEqual(
            parseSingleTableSelection(employees.columns),
            createSingleTableSelection([ 'id', 'firstName', 'lastName', 'title', 'salary', 'departmentId', 'fulltime' ])
        )
    })
})