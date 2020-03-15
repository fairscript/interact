import * as assert from 'assert'
import {parseMap} from '../../lib/parsing/map_parsing'
import {Employee} from '../test_tables'
import {createAlias, createGet} from '../../lib/column_operations'
import {parseGet} from '../../lib/generation/get_parsing'

describe('parseGet', function () {
    it('returns an object satisfying the Get instance', () => {
        assert.deepEqual(
            parseGet((e: Employee) => e.id),
            createGet(1, 'id')
        )
    })
})