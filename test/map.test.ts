import * as assert from 'assert'
import {parseMap} from '../lib/map'
import {Employee} from './test_tables'

describe('parseMap', function () {
    it('can accept the selection of a single property', () => {
        assert.equal(
            parseMap((e: Employee) => e.id),
            't1.id'
        )
    })

    it('transforms to snake-case naming style', () => {
        assert.equal(
            parseMap((e: Employee) => e.firstName),
            't1.first_name'
        )
    })

    describe('can parse an object ', () => {
        it('with a single key', () => {
            assert.equal(
                parseMap((e: Employee) => ({id: e.id})),
                't1.id AS id'
            )
        })

        it('with two keys', () => {
            assert.equal(
                parseMap((e: Employee) => ({firstName: e.firstName, lastName: e.lastName})),
                't1.first_name AS firstName, t1.last_name AS lastName'
            )
        })
    })
})