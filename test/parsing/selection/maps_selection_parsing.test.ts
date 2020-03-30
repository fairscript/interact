import * as assert from 'assert'
import {
    createGetColumn,
    createSubselect
} from '../../../lib/column_operations'
import {parseMapWithSubquerySelection} from '../../../lib/parsing/selection/maps_selection_parsing'
import {createSubselectStatement} from '../../../lib/select_statement'
import {createMapSelection} from '../../../lib/parsing/selection/map_selection_parsing'
import {createEquality, createGreaterThan} from '../../../lib/parsing/predicate/comparison'
import {createParameterlessFilter} from '../../../lib/parsing/filtering/parameterless_filter_parsing'

describe('parseMapS can parse a map with a subquery', function () {

    it('with one filter', () => {
        const actual = parseMapWithSubquerySelection(
            (st, e) => ({
                id: e.id,
                higherSalary: st.filter(se => se.salary > e.salary).count()
            }),
            ['employees'])

        const expectedSubselectStatement = createSubselectStatement(
            'employees',
            [
                createParameterlessFilter(
                    {se: 's1', e: 't1'},
                    createGreaterThan(createGetColumn('se', 'salary'), createGetColumn('e', 'salary'))
                )
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
        const actual = parseMapWithSubquerySelection(
            (st, e) => ({
                id: e.id,
                higherSalary: st.filter(se => se.salary > e.salary).filter(se => se.departmentId === e.departmentId).count()
            }),
            ['employees'])

        const tableParameterNameToTableAlias = {se: 's1', e: 't1'}
        const expectedSubselectStatement = createSubselectStatement(
            'employees',
            [
                createParameterlessFilter(
                    tableParameterNameToTableAlias,
                    createGreaterThan(createGetColumn('se', 'salary'), createGetColumn('e', 'salary'))
                ),
                createParameterlessFilter(
                    tableParameterNameToTableAlias,
                    createEquality(createGetColumn('se', 'departmentId'), createGetColumn('e', 'departmentId'))
                )
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