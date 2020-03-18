import * as assert from 'assert'
import {
    createGetFromParameter,
    createSubselect
} from '../../lib/column_operations'
import {parseMapS} from '../../lib/parsing/maps_parsing'
import {createEquality, createFilter, createGreaterThan} from '../../lib/parsing/filter_parsing'
import {createSubselectStatement} from '../../lib/select_statement'
import {createMapSelection} from '../../lib/parsing/map_parsing'

describe('parseMapS can parse a map with a subquery', function () {

    it('with one filter', () => {
        const actual = parseMapS(
            (st, e) => ({
                id: e.id,
                higherSalary: st.filter(se => se.salary > e.salary).count()
            }),
            ['employees'])

        const expectedSubselectStatement = createSubselectStatement(
            'employees',
            [
                createFilter(
                    {se: 's1', e: 't1'},
                    createGreaterThan(createGetFromParameter('se', 'salary'), createGetFromParameter('e', 'salary'))
                )
            ])

        const expected = createMapSelection(
            {
                e: 't1'
            },
            [
                ['id', createGetFromParameter('e', 'id')],
                ['higherSalary', createSubselect(expectedSubselectStatement)]
            ])

        assert.deepEqual(actual, expected)
    })

    it('with two filters', () => {
        const actual = parseMapS(
            (st, e) => ({
                id: e.id,
                higherSalary: st.filter(se => se.salary > e.salary).filter(se => se.departmentId === e.departmentId).count()
            }),
            ['employees'])

        const expectedSubselectStatement = createSubselectStatement(
            'employees',
            [
                createFilter(
                    {se: 's1', e: 't1'},
                    createGreaterThan(createGetFromParameter('se', 'salary'), createGetFromParameter('e', 'salary'))
                ),
                createFilter(
                    {se: 's1', e: 't1'},
                    createEquality(createGetFromParameter('se', 'departmentId'), createGetFromParameter('e', 'departmentId'))
                )
            ])

        const expected = createMapSelection(
            {
                e: 't1'
            },
            [
                ['id', createGetFromParameter('e', 'id')],
                ['higherSalary', createSubselect(expectedSubselectStatement)]
            ])

        assert.deepEqual(actual, expected)
    })
})