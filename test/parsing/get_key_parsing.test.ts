import {createPartOfKey, parseGetKey} from '../../lib/parsing/get_key_parsing'
import {Department, departments, Employee, employees} from '../test_tables'
import * as assert from 'assert'
import {createAlias, createGet} from '../../lib/column_operations'

describe('parseGetKey', () => {

    describe('returns an array', () => {

        it('with one Get item when one property is selected', () => {
            assert.deepEqual(
                parseGetKey((e: Employee) => ({departmentId: e.departmentId})),
                [ createPartOfKey(createGet(1, 'departmentId'), 'departmentId') ]
            )
        })

        it('with two Get items when two properties are selected', () => {
            assert.deepEqual(
                parseGetKey((e: Employee) => ({departmentId: e.departmentId, title: e.title})),
                [ createPartOfKey(createGet(1, 'departmentId'), 'departmentId'), createPartOfKey(createGet(1, 'title'), 'title') ]
            )
        })

    })

    describe('works for joins of two tables', () => {
        it('when the key is on the first table', () => {
            assert.deepEqual(
                parseGetKey((e: Employee, d: Department) => ({departmentId: e.departmentId})),
                [ createPartOfKey(createGet(1, 'departmentId'), 'departmentId') ]
            )
        })

        it('when the key is on the second table', () => {
            assert.deepEqual(
                parseGetKey((e: Employee, d: Department) => ({departmentId: d.id})),
                [ createPartOfKey(createGet(2, 'id'), 'departmentId') ]
            )
        })

        it('when the key is on both tables', () => {
            assert.deepEqual(
                parseGetKey((e: Employee, d: Department) => ({title: e.title, departmentId: d.id})),
                [ createPartOfKey(createGet(1, 'title'), 'title'), createPartOfKey(createGet(2, 'id'), 'departmentId') ]
            )
        })
    })

})