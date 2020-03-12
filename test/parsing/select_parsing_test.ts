import {Employee} from '../test_tables'
import {extractPropertiesFromConstructor} from '../../lib/parsing/select_parsing'
import * as assert from 'assert'

describe('extractPropertiesFromConstructor', () => {
    it('returns a comma/space-separated list of property names', () => {
        assert.deepEqual(
            extractPropertiesFromConstructor(Employee),
            [
                {object: null, property: 'id', kind: 'get'},
                {object: null, property: 'firstName', kind: 'get'},
                {object: null, property: 'lastName', kind: 'get'},
                {object: null, property: 'title', kind: 'get'},
                {object: null, property: 'salary', kind: 'get'},
                {object: null, property: 'departmentId', kind: 'get'}
            ])
    })
})