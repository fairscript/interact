import * as assert from 'assert'
import {createMapSelection, parseMapSelection} from '../../../lib/parsing/selection/map_selection_parsing'
import {createGetColumn} from '../../../lib/parsing/value_expressions/get_column_parsing'
import {Employee} from '../../../lib/test/model/employee'

describe('parseMap can parse an object', function () {
    it('with a single key', () => {
        assert.deepEqual(
            parseMapSelection((e: Employee) => ({employeeId: e.id})),
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
            parseMapSelection((e: Employee) => ({first: e.firstName, last: e.lastName})),
            createMapSelection(
                {e: 't1'},
                [
                    ['first', createGetColumn('e', 'firstName')],
                    ['last', createGetColumn('e', 'lastName')]
                ])
        )
    })
})