import {generateSubselectStatement} from '../../lib/generation/subselect_generation'
import * as assert from 'assert'
import {createParameterlessFilter} from '../../lib/parsing/filtering/parameterless_filter_parsing'
import {sqliteDialect} from '../../../interact-with-sqlite/lib/sqlite_dialect'
import {createCountSelection} from '../../lib/parsing/selection/count_selection'
import {createGreaterThan} from '../../lib/parsing/boolean_expressions/comparisons'
import {createGetColumn} from '../../lib/parsing/value_expressions/get_column_parsing'

describe('generateSubselect', () => {
    it('works for a subselect statement with one filter', () => {
        const filter = createParameterlessFilter(
            {
                se: 's1',
                e: 't1'
            },
            createGreaterThan(
                createGetColumn('se', 'salary'),
                createGetColumn('e', 'salary')
            )
        )

        assert.equal(
            generateSubselectStatement(sqliteDialect.namedParameterPrefix, sqliteDialect.generateConvertToInteger, sqliteDialect.generateConvertToFloat, createCountSelection(), 'employees', [filter]),
            '(SELECT COUNT(*) FROM employees s1 WHERE s1.salary > t1.salary)'
        )
    })
})