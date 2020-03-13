import {parseGetKey} from '../../lib/parsing/get_key_parsing'
import {Employee} from '../test_tables'
import * as assert from 'assert'
import {createGet} from '../../lib/column_operations'

describe('parseGetKey', () => {

    describe('returns an array', () => {

        it('with one Alias item when one property is selected', () => {
            assert.deepEqual(
                parseGetKey((e: Employee) => ({departmentId: e.departmentId})),
                [ createGet(1, 'departmentId') ]
            )
        })

        it('with two Alias items when two properties are selected', () => {
            assert.deepEqual(
                parseGetKey((e: Employee) => ({departmentId: e.departmentId, title: e.title})),
                [ createGet(1, 'departmentId'), createGet(1, 'title') ]
            )
        })

    })

})