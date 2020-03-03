import {Employee} from './test_tables'
import {computeFieldList} from '../lib/select'
import * as assert from 'assert'

describe('parseSelect', () => {
    it('returns a comma/space-separated list of aliased field names', () => {
        assert.equal(computeFieldList(Employee), 't1.id, t1.first_name, t1.last_name, t1.title, t1.department_id')
    })
})