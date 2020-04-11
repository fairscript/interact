import * as assert from 'assert'
import {generateLimit} from '../../lib/generation/limit_generation'

describe('generateLimit', () => {

    it('returns LIMIT 1 when the limit is set to 1', () => {
        assert.equal('LIMIT 1', generateLimit(1))
    })

    it('returns LIMIT 2 when the limit is set to 2', () => {
        assert.equal('LIMIT 2', generateLimit(2))
    })

})