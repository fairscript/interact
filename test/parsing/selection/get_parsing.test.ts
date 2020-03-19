import * as assert from 'assert'
import {Employee} from '../../test_tables'
import {createGetSelection, parseGet} from '../../../lib/parsing/selection/get_parsing'

describe('parseGet', function () {
    it('returns an object satisfying the Get instance', () => {
        assert.deepEqual(
            parseGet((e: Employee) => e.id),
            createGetSelection('t1', 'id')
        )
    })
})