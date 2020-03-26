import {createGetColumn, createSubselect} from '../../lib/column_operations'
import {generateSubselect} from '../../lib/generation/subselect_generation'
import {createSubselectStatement} from '../../lib/select_statement'
import * as assert from 'assert'
import {createGreaterThan} from '../../lib/parsing/predicate/comparison'
import {createParameterlessFilter} from '../../lib/parsing/filtering/parameterless_filter_parsing'
import {sqliteDialect} from '../../lib/databases/sqlite/sqlite_dialect'

describe('generateSubselect', () => {
    it('works for a subselect statement with one filter', () => {
        const subselectStatement = createSubselectStatement(
            "employees",
            [
                createParameterlessFilter(
                    {
                        se: 's1',
                        e: 't1'
                    },
                    createGreaterThan(
                        createGetColumn('se', 'salary'),
                        createGetColumn('e', 'salary')
                    )
                )
            ]
        )
        const subselect = createSubselect(subselectStatement)

        assert.equal(
            generateSubselect(sqliteDialect.namedParameterPrefix, sqliteDialect.useNamedParameterPrefixInRecord, subselect),
            '(SELECT COUNT(*) FROM employees s1 WHERE s1.salary > t1.salary)'
        )
    })
})