import * as assert from 'assert'
import {parseMap} from '../../lib/parsing/map_parsing'
import {Employee} from '../test_tables'
import {createAlias, createGet} from '../../lib/column_operations'

describe('parseMap', function () {
    it('can accept the selection of a single property', () => {
        assert.deepEqual(
            parseMap((e: Employee) => e.id),
            [ createGet(1, 'id') ]
        )
    })

    describe('can parse an object ', () => {
        it('with a single key', () => {
            assert.deepEqual(
                parseMap((e: Employee) => ({employeeId: e.id})),
                [ createAlias(createGet(1, 'id'), 'employeeId') ]
            )
        })

        it('with two keys', () => {
            assert.deepEqual(
                parseMap((e: Employee) => ({first: e.firstName, last: e.lastName})),
                [
                    createAlias(createGet(1, 'firstName'), 'first'),
                    createAlias(createGet(1, 'lastName'), 'last')
                ]
            )
        })
    })
})