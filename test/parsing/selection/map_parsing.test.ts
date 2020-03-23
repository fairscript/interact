import * as assert from 'assert'
import {createMapSelection, parseMap} from '../../../lib/parsing/selection/map_parsing'
import {Employee} from '../../test_tables'
import {createGetColumn} from '../../../lib/column_operations'

describe('parseMap can parse an object', function () {
    it('with a single key', () => {
        assert.deepEqual(
            parseMap((e: Employee) => ({employeeId: e.id})),
            createMapSelection(
                {e: 't1'},
                [
                    ['employeeId', createGetColumn('e', 'id')]
                ]
            )
        )
    })

    it('with two keys', () => {
        assert.deepEqual(
            parseMap((e: Employee) => ({first: e.firstName, last: e.lastName})),
            createMapSelection(
                {e: 't1'},
                [
                    ['first', createGetColumn('e', 'firstName')],
                    ['last', createGetColumn('e', 'lastName')]
                ])
        )
    })
})