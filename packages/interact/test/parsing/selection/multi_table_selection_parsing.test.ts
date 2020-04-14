import * as assert from 'assert'
import {
    createMultiTableSelection,
    parseMultipleTableSelection
} from '../../../lib/parsing/selection/multi_table_selection_parsing'
import {departments, employees} from '../../../lib/test/test_tables'

describe('parseMultiTableSelect', () => {
    it('returns an array of objects satisfying the Alias interface', () => {
        assert.deepEqual(
            parseMultipleTableSelection(['employee', 'department'], [employees.columns, departments.columns]),
            createMultiTableSelection(
                [
                    ['employee', ['id', 'firstName', 'lastName', 'title', 'salary', 'departmentId', 'fulltime']],
                    ['department', ['id', 'name', 'companyId']]
                ]))
    })
})