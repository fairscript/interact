import {Employee} from '../test_tables'
import {extractPropertiesFromConstructor} from '../../lib/parsing/select_parsing'
import * as assert from 'assert'

describe('extractPropertiesFromConstructor', () => {
    it('returns an array of objects satisfying the Get interface', () => {
        assert.deepEqual(
            extractPropertiesFromConstructor(Employee),
            [
                {table: 1, column: 'id', kind: 'get'},
                {table: 1, column: 'firstName', kind: 'get'},
                {table: 1, column: 'lastName', kind: 'get'},
                {table: 1, column: 'title', kind: 'get'},
                {table: 1, column: 'salary', kind: 'get'},
                {table: 1, column: 'departmentId', kind: 'get'}
            ])
    })
})