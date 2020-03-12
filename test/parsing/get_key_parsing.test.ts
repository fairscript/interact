import {parseGetKey} from '../../lib/parsing/get_key_parsing'
import {Employee} from '../test_tables'
import {createGet} from '../../lib/parsing/select_parsing'
import * as assert from 'assert'

describe('parseGetKey', () => {

    describe('returns an array', () => {

        it('with one Alias item when one property is selected', () => {
            assert.deepEqual(
                parseGetKey((e: Employee) => ({departmentId: e.departmentId})),
                [ createGet('e', 'departmentId') ]
            )
        })

        it('with two Alias items when two properties are selected', () => {
            assert.deepEqual(
                parseGetKey((e: Employee) => ({departmentId: e.departmentId, title: e.title})),
                [ createGet('e', 'departmentId'), createGet('e', 'title') ]
            )
        })

    })

})