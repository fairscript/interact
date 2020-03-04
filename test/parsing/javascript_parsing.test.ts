import {aString, float, identifier, integer} from '../../lib/parsing/parsing'
import * as assert from 'assert'
import {extractLambdaString} from '../../lib/parsing/lambda_string'

describe('aString', () => {
    it('matches quote, character, quote', () => {
        assert.equal(aString.run('\'a\'').result, '\'a\'')
    })

    it('matches quote, two characters, quote', () => {
        assert.equal(aString.run('\'ab\'').result, '\'ab\'')
    })

    it('matches quote, I, slash, quote, m, quote', () => {
        const lambdaString = extractLambdaString(() => 'I\'m')

        const result = aString.run(lambdaString).result
        assert.equal(result, "'I\\'m'")
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