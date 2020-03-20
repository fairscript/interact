import {Department, Employee} from '../../test_tables'
import * as assert from 'assert'
import {
    createMultiTableSelection,
    parseSelectMultipleTables
} from '../../../lib/parsing/selection/multi_table_selection_parsing'

describe('parseMultiTableSelect', () => {
    it('returns an array of objects satisfying the Alias interface', () => {
        assert.deepEqual(
            parseSelectMultipleTables([['employee', Employee], ['department', Department]]),
            createMultiTableSelection(
                {
                    employee: 't1',
                    department: 't2'
                },
                [
                    ['employee_id', ['employee', 'id']],
                    ['employee_firstName', ['employee', 'firstName']],
                    ['employee_lastName', ['employee', 'lastName']],
                    ['employee_title', ['employee', 'title']],
                    ['employee_salary', ['employee', 'salary']],
                    ['employee_departmentId', ['employee', 'departmentId']],

                    ['department_id', ['department', 'id']],
                    ['department_name', ['department', 'name']]
                ]))
    })
})