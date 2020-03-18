import {Department, Employee} from '../test_tables'
import {
    createMultiTableSelection,
    createSingleTableSelection,
    parseSelectMultipleTables,
    parseSelectSingleTable
} from '../../lib/parsing/select_parsing'
import * as assert from 'assert'

describe('parseSelectSingleTable', () => {
    it('returns an array of objects satisfying the Get interface', () => {
        assert.deepEqual(
            parseSelectSingleTable(Employee),
            createSingleTableSelection([ 'id', 'firstName', 'lastName', 'title', 'salary', 'departmentId' ])
        )
    })
})

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