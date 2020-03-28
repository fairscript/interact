import * as assert from 'assert'
import {Employee} from '../../test_tables'
import {createGetSelection, parseGet} from '../../../lib/parsing/selection/get_parsing'
import {mapParameterNamesToTableAliases} from '../../../lib/generation/table_aliases'
import {createGetColumn} from '../../../lib/column_operations'

describe('parseGet', function () {
    it('returns an object satisfying the Get instance', () => {
        assert.deepEqual(
            parseGet((e: Employee) => e.id),
            createGetSelection(mapParameterNamesToTableAliases(['e']), createGetColumn('e', 'id'))
        )
    })
})