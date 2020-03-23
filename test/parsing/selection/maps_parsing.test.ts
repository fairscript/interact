import * as assert from 'assert'
import {
    createGetColumn,
    createSubselect
} from '../../../lib/column_operations'
import {parseMapS} from '../../../lib/parsing/selection/maps_parsing'
import {createFilter} from '../../../lib/parsing/filter_parsing'
import {createSubselectStatement} from '../../../lib/select_statement'
import {createMapSelection} from '../../../lib/parsing/selection/map_parsing'
import {createEquality, createGreaterThan} from '../../../lib/parsing/predicate/comparison'

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
                createFilter(createGreaterThan(createGetColumn('se', 'salary'), createGetColumn('e', 'salary')), {se: 's1', e: 't1'})
            ])

        const expected = createMapSelection(
            {
                e: 't1'
            },
            [
                ['id', createGetColumn('e', 'id')],
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
                createFilter(createGreaterThan(createGetColumn('se', 'salary'), createGetColumn('e', 'salary')), {se: 's1', e: 't1'}),
                createFilter(createEquality(createGetColumn('se', 'departmentId'), createGetColumn('e', 'departmentId')), {se: 's1', e: 't1'})
            ])

        const expected = createMapSelection(
            {
                e: 't1'
            },
            [
                ['id', createGetColumn('e', 'id')],
                ['higherSalary', createSubselect(expectedSubselectStatement)]
            ])

        assert.deepEqual(actual, expected)
    })
})