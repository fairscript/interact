import * as assert from 'assert'
import {
    createLeftSideOfJoin,
    createRightSideOfJoin,
    parseJoin,
    parseLeftSide,
    parseRightSide
} from '../../lib/parsing/join_parsing'
import {createGetColumn} from '../../lib/parsing/value_expressions/get_column_parsing'
import {Employee} from '../../lib/test/model/employee'
import {Department} from '../../lib/test/model/department'

describe('parseLeftSide works', () => {
    it(' in a join of two tables', () => {
        assert.deepEqual(
            parseLeftSide((e: Employee) => e.departmentId),
            createLeftSideOfJoin({'e': 't1'}, createGetColumn('e', 'departmentId')))
    })

    describe('when a third table is joined', () => {
        it('on a column of the first table', () => {
            assert.deepEqual(
                parseLeftSide((e, d) => e.companyId),
                createLeftSideOfJoin({'e': 't1', 'd': 't2'}, createGetColumn('e', 'companyId'))
            )
        })

        it('on a column of the second table', () => {
            assert.deepEqual(
                parseLeftSide((e, d) => d.companyId),
                createLeftSideOfJoin({'e': 't1', 'd': 't2'}, createGetColumn('d', 'companyId'))
            )
        })
    })
})

describe('parseRightSide works', () => {
    it('when a second table is joined', () => {
        assert.deepEqual(
            parseRightSide((d: Department) => d.id, 1),
            createRightSideOfJoin('t2', createGetColumn('d', 'id')))
    })

    it('when a third table is joined', () => {
        assert.deepEqual(
            parseRightSide(c => c.id, 2),
            createRightSideOfJoin('t3', createGetColumn('c', 'id'))
        )
    })
})