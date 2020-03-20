import {Employee} from '../../test_tables'
import * as assert from 'assert'
import {
    createSingleTableSelection,
    parseSelectSingleTable
} from '../../../lib/parsing/selection/single_table_selection_parsing'

describe('parseSelectSingleTable', () => {
    it('returns an array of objects satisfying the Get interface', () => {
        assert.deepEqual(
            parseSelectSingleTable(Employee),
            createSingleTableSelection([ 'id', 'firstName', 'lastName', 'title', 'salary', 'departmentId' ])
        )
    })
})