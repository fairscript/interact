import * as assert from 'assert'
import {parseMap} from '../../lib/parsing/map_parsing'
import {Employee} from '../test_tables'
import {createAlias, createGet} from '../../lib/parsing/select_parsing'

describe('parseMap', function () {
    it('can accept the selection of a single property', () => {
        assert.deepEqual(
            parseMap((e: Employee) => e.id),
            [ createGet('e', 'id') ]
        )
    })

    describe('can parse an object ', () => {
        it('with a single key', () => {
            assert.deepEqual(
                parseMap((e: Employee) => ({employeeId: e.id})),
                [ createAlias(createGet('e', 'id'), 'employeeId') ]
            )
        })

        it('with two keys', () => {
            assert.deepEqual(
                parseMap((e: Employee) => ({first: e.firstName, last: e.lastName})),
                [
                    createAlias(createGet('e', 'firstName'), 'first'),
                    createAlias(createGet('e', 'lastName'), 'last')
                ]
            )
        })
    })
})