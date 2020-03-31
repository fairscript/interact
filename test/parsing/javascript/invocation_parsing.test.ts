import {createParameterlessFunctionInvocation} from '../../../lib/parsing/javascript/invocation_parsing'
import * as assert from 'assert'

describe('createParameterlessFunctionInvocation creates a parser', () => {
    it('that matches name()', () => {
        assert.deepEqual(createParameterlessFunctionInvocation('count').run('count()').result, 'count')
    })
})