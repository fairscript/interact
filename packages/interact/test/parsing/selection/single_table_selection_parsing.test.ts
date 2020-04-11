import * as assert from 'assert'
import {
    createSingleTableSelection,
    parseSingleTableSelection
} from '../../../lib/parsing/selection/single_table_selection_parsing'
import {Employee} from '../../../lib'

describe('parseSelectSingleTable', () => {
    it('returns an array of objects satisfying the Get interface', () => {
        assert.deepEqual(
            parseSingleTableSelection(Employee),
            createSingleTableSelection([ 'id', 'firstName', 'lastName', 'title', 'salary', 'departmentId', 'fulltime' ])
        )
    })
})