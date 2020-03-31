import * as assert from 'assert'
import {Employee} from '../../test_tables'
import {parseGetSelection} from '../../../lib/parsing/selection/get_selection_parsing'
import {mapParameterNamesToTableAliases} from '../../../lib/generation/table_aliases'
import {createSingleColumnSelection} from '../../../lib/parsing/selection/single_column_selection_parsing'
import {createGetColumn} from '../../../lib/parsing/get_column_parsing'

describe('parseGet', function () {
    it('returns an object satisfying the Get instance', () => {
        assert.deepEqual(
            parseGetSelection((e: Employee) => e.id),
            createSingleColumnSelection(mapParameterNamesToTableAliases(['e']), createGetColumn('e', 'id'))
        )
    })
})