import {createGetFromParameter, createSubselect} from '../../lib/column_operations'
import {generateSubselect} from '../../lib/generation/subselect_generation'
import {createSubselectStatement} from '../../lib/select_statement'
import {createFilter} from '../../lib/parsing/filter_parsing'
import * as assert from 'assert'
import {createGreaterThan} from '../../lib/parsing/predicate/comparison'

describe('generateSubselect', () => {
    it('works for a subselect statement with one filter', () => {
        const subselectStatement = createSubselectStatement(
            "employees",
            [
                createFilter(
                    {
                        se: 's1',
                        e: 't1'
                    },
                    createGreaterThan(
                        createGetFromParameter('se', 'salary'),
                        createGetFromParameter('e', 'salary')
                    )
                )
            ]
        )
        const subselect = createSubselect(subselectStatement)

        assert.equal(
            generateSubselect(subselect),
            '(SELECT COUNT(*) FROM employees s1 WHERE s1.salary > t1.salary)'
        )
    })
})