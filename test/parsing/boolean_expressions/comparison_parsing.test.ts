import * as A from 'arcsecond'
import * as assert from 'assert'

import {
    createComparisonParser,
    mapDoubleEqualityToTripleEquality
} from '../../../lib/parsing/boolean_expressions/comparison_parsing'
import {jsComparisonOperators} from '../../../lib/parsing/boolean_expressions/comparison_operators'

describe('createComparisonParser returns a parser that', () => {

    const parser = createComparisonParser(A.str('side'))

    it('matches side [comparison operator] side', () => {
        jsComparisonOperators.forEach(operator => {
            assert.deepEqual(
                parser.run(`side ${operator} side`).result,
                ['side', mapDoubleEqualityToTripleEquality(operator), 'side']
            )
        })
    })

})