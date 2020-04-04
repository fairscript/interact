import {createGetColumn} from '../../../../../lib/parsing/get_column_parsing'
import {createConstant} from '../../../../../lib/parsing/predicates/side_parsing'
import {
    createGreaterThan,
    createGreaterThanOrEqual,
    createLessThan, createLessThanOrEqual, createNotEqual
} from '../../../../../lib/parsing/predicates/comparisons'
import {createParameterlessParser} from '../../../../../lib/parsing/predicates/predicate_parsing'
import {createAssertParameterlessPredicateParserMatches} from '../../predicate_assertion'

const parser = createParameterlessParser(['e'])
const assertMatches = createAssertParameterlessPredicateParserMatches(parser)

describe('parseParameterlessPredicate can parse inequalities with the operator', () => {
    const getSalary = createGetColumn('e', 'salary')
    const fiveThousand = createConstant(5_000)

    it('not equal to', () => {
        assertMatches(
            e => e.salary != 5000,
            createNotEqual(getSalary, fiveThousand)
        )
    })

    it('not strictly equal to', () => {
        assertMatches(
            e => e.salary !== 5000,
            createNotEqual(getSalary, fiveThousand)
        )
    })

    it('greater than', () => {
        assertMatches(
            e => e.salary > 5000,
            createGreaterThan(getSalary, fiveThousand)
        )
    })

    it('greater than or equal to', () => {
        assertMatches(
            e => e.salary >= 5000,
            createGreaterThanOrEqual(getSalary, fiveThousand)
        )
    })

    it('less than', () => {
        assertMatches(
            e => e.salary < 5000,
            createLessThan(getSalary, fiveThousand)
        )
    })

    it('less than or equal to', () => {
        assertMatches(
            e => e.salary <= 5000,
            createLessThanOrEqual(getSalary, fiveThousand)
        )
    })
})