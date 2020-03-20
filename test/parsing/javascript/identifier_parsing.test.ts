import * as assert from 'assert'
import {identifier} from '../../../lib/parsing/javascript/identifier_parsing'

describe('identifier', () => {

    describe('matches', () => {

        it('lower camel case alphabetic identifiers', () => {
            assert.equal(
                identifier.run('firstName').result,
                'firstName'
            )
        })
    })
})