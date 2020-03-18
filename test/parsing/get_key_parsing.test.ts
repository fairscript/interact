import {createKey, createPartOfKey, parseGetKey} from '../../lib/parsing/get_key_parsing'
import {Department, Employee} from '../test_tables'
import * as assert from 'assert'
import {createGetFromParameter} from '../../lib/column_operations'

describe('parseGetKey', () => {

    describe('returns an array', () => {

        it('with one Get item when one property is selected', () => {
            assert.deepEqual(
                parseGetKey((e: Employee) => ({departmentId: e.departmentId})),
                createKey(
                    {e: 't1'},
                    [createPartOfKey('departmentId', createGetFromParameter('e', 'departmentId'))]
                )
            )
        })

        it('with two Get items when two properties are selected', () => {
            assert.deepEqual(
                parseGetKey((e: Employee) => ({departmentId: e.departmentId, title: e.title})),
                createKey(
                    {e: 't1'},
                    [
                        createPartOfKey('departmentId', createGetFromParameter('e', 'departmentId')),
                        createPartOfKey('title', createGetFromParameter('e', 'title'))
                    ]
                )

            )
        })

    })

    describe('works for joins of two tables', () => {
        it('when the key is on the first table', () => {
            assert.deepEqual(
                parseGetKey((e: Employee, d: Department) => ({departmentId: e.departmentId})),
                createKey(
                    {e: 't1', d: 't2'},
                    [ createPartOfKey('departmentId', createGetFromParameter('e', 'departmentId')) ]
                )
            )
        })

        it('when the key is on the second table', () => {
            assert.deepEqual(
                parseGetKey((e: Employee, d: Department) => ({departmentId: d.id})),
                createKey(
                    {e: 't1', d: 't2'},
                    [ createPartOfKey('departmentId', createGetFromParameter('d', 'id')) ]
                )

            )
        })

        it('when the key is on both tables', () => {
            assert.deepEqual(
                parseGetKey((e: Employee, d: Department) => ({title: e.title, departmentId: d.id})),
                createKey(
                    {e: 't1', d: 't2'},
                    [
                        createPartOfKey('title', createGetFromParameter('e', 'title')),
                        createPartOfKey('departmentId', createGetFromParameter('d', 'id'))
                    ]
                )

            )
        })
    })

})