import * as assert from 'assert'
import {float, integer} from '../../../lib/parsing/literals/number_parsing'

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