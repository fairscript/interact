import {createGetColumn} from '../../../../../lib/parsing/value_expressions/get_column_parsing'
import {
    createGreaterThan,
    createGreaterThanOrEqual,
    createLessThan, createLessThanOrEqual, createNotEqual
} from '../../../../../lib/parsing/boolean_expressions/comparisons'
import {createParameterlessBooleanExpressionParser} from '../../../../../lib/parsing/boolean_expressions/boolean_expression_parsing'
import {createAssertParameterlessBooleanExpressionParserMatches} from '../../boolean_expression_assertion'
import {createLiteral} from '../../../../../lib/parsing/values/literal'

const parser = createParameterlessBooleanExpressionParser(['e'])
const assertMatches = createAssertParameterlessBooleanExpressionParserMatches(parser)

describe('parseParameterlessPredicate can parse inequalities with the operator', () => {
    const getSalary = createGetColumn('e', 'salary')
    const fiveThousand = createLiteral(5_000)

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