import * as assert from 'assert'
import {
    createMultiTableSelection,
    parseMultipleTableSelection
} from '../../../lib/parsing/selection/multi_table_selection_parsing'
import {Employee} from '../../../lib/test/model/employee'
import {Department} from '../../../lib/test/model/department'

describe('parseMultiTableSelect', () => {
    it('returns an array of objects satisfying the Alias interface', () => {
        assert.deepEqual(
            parseMultipleTableSelection([['employee', Employee], ['department', Department]]),
            createMultiTableSelection(
                [
                    ['employee', ['id', 'firstName', 'lastName', 'title', 'salary', 'departmentId', 'fulltime']],
                    ['department', ['id', 'name', 'companyId']]
                ]))
    })
})