import * as assert from 'assert'
import {identifier} from '../../lib/parsing/javascript/identifier_parsing'
import {aString, float, integer} from '../../lib/parsing/javascript/value_parsing'

describe('aString matches strings', () => {
    describe('surrounded by single quotes', () => {
        it('containing a single character', () => {
            assert.equal(aString.run("'a'").result, "'a'")
        })

        it('containing a two characters', () => {
            assert.equal(aString.run("'ab'").result, "'ab'")
        })

        it('containing an escaped single quote', () => {
            assert.equal(aString.run("'I\\'m'").result, "'I\\'m'")
        })
    })

    describe('surrounded by double quotes', () => {
        it('containing a single character', () => {
            assert.equal(aString.run('"a"').result, '"a"')
        })

        it('containing a two characters', () => {
            assert.equal(aString.run('"ab"').result, '"ab"')
        })
    })

})

describe('integer', () => {
    describe('matches', () => {
        it('0', () => {
            assert.equal(integer.run('0').result, '0')
        })

        it('1', () => {
            assert.equal(integer.run('1').result, '1')
        })

        it('10', () => {
            assert.equal(integer.run('10').result, '10')
        })

        it('-1', () => {
            assert.equal(integer.run('-1').result, '-1')
        })

        it('+1', () => {
            assert.equal(integer.run('+1').result, '+1')
        })

    })
})

describe('float', () => {
    describe('matches', () => {
        it('0.0', () => {
            assert.equal(float.run('0.0').result, '0.0')
        })

        it('0.1', () => {
            assert.equal(float.run('0.1').result, '0.1')
        })

        it('-0.1', () => {
            assert.equal(float.run('-0.1').result, '-0.1')
        })

        it('+0.1', () => {
            assert.equal(float.run('+0.1').result, '+0.1')
        })
    })
})

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