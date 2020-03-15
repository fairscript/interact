import * as assert from 'assert'
import {parseMap} from '../../lib/parsing/map_parsing'
import {Employee} from '../test_tables'
import {createAlias, createCount, createGet, createSubselect} from '../../lib/column_operations'
import {parseMapS} from '../../lib/parsing/maps_parsing'
import {createEquality} from '../../lib/parsing/predicate_parsing'

describe('parseMapS can parse an object', function () {
    xit('with a subquery', () => {
        /* assert.deepEqual(
            parseMapS((st, e) => ({
                id: e.id,
                sameSalary: st.filter(se => se.salary = e.salary).count()
            })),
            [
                createAlias(createGet(1, 'id'), 'id'),
                createAlias(
                    createSubselect({ tableName: 'employees', selection: createCount(), predicates: [createEquality()] }),
                    'sameSalary')
            ]
        ) */
    })
})