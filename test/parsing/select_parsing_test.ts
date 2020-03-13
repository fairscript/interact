import {Department, Employee} from '../test_tables'
import {parseMultiTableSelect, parseSingleTableSelect} from '../../lib/parsing/select_parsing'
import * as assert from 'assert'
import {createAlias, createGet} from '../../lib/column_operations'

describe('parseSingleTableSelect', () => {
    it('returns an array of objects satisfying the Get interface', () => {
        assert.deepEqual(
            parseSingleTableSelect(Employee),
            [
                createGet(1, 'id'),
                createGet(1, 'firstName'),
                createGet(1, 'lastName'),
                createGet(1, 'title'),
                createGet(1, 'salary'),
                createGet(1, 'departmentId')
            ])
    })
})

describe('parseMultiTableSelect', () => {
    it('returns an array objects satisfying the Alias interface', () => {
        assert.deepEqual(
            parseMultiTableSelect({ employee: Employee, department: Department }),
            [
                createAlias(createGet(1, 'id'), 'employee_id'),
                createAlias(createGet(1, 'firstName'), 'employee_firstName'),
                createAlias(createGet(1, 'lastName'), 'employee_lastName'),
                createAlias(createGet(1, 'title'), 'employee_title'),
                createAlias(createGet(1, 'salary'), 'employee_salary'),
                createAlias(createGet(1, 'departmentId'), 'employee_departmentId'),

                createAlias(createGet(2, 'id'), 'department_id'),
                createAlias(createGet(2, 'name'), 'department_name')
            ])
    })
})