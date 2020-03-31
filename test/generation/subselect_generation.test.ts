import {generateSubselectStatement} from '../../lib/generation/subselect_generation'
import {createSubselectStatement} from '../../lib/select_statement'
import * as assert from 'assert'
import {createParameterlessFilter} from '../../lib/parsing/filtering/parameterless_filter_parsing'
import {sqliteDialect} from '../../lib/databases/sqlite/sqlite_dialect'
import {createCountSelection} from '../../lib/parsing/selection/count_selection'
import {createGreaterThan} from '../../lib/parsing/predicates/comparisons'
import {createGetColumn} from '../../lib/parsing/get_column_parsing'

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
            ],
            createCountSelection()
        )
        assert.equal(
            generateSubselectStatement(sqliteDialect.namedParameterPrefix, subselectStatement),
            '(SELECT COUNT(*) FROM employees s1 WHERE s1.salary > t1.salary)'
        )
    })
})