import {Comparison} from '../../parsing/boolean_expressions/comparisons'
import {generateValueExpression} from '../value_expressions/value_expression_generation'
import {SqlComparisonOperator} from '../../parsing/boolean_expressions/comparison_operators'

export function generateComparison(namedParameterPrefix: string, parameterNameToTableAlias: { [parameterName: string]: string }, comparison: Comparison): string {
    const {left, operator, right} = comparison

    const generatedLeft = generateValueExpression(namedParameterPrefix, parameterNameToTableAlias, left)
    const generatedOperator = generateOperator(operator, right.kind === 'null')
    const generatedRight = generateValueExpression(namedParameterPrefix, parameterNameToTableAlias, right)

    return `${generatedLeft} ${generatedOperator} ${generatedRight}`
}

export function generateOperator(operator, rightHandSideIsNull: boolean): SqlComparisonOperator {
    if (rightHandSideIsNull) {
        switch (operator) {
            case '===':
            case '==':
                return 'IS'
            case '!==':
            case '!=':
                return 'IS NOT'
            default:
                throw Error('An inequality with NULL on the right-hand side is not permitted.')
        }
    }
    else {
        switch (operator) {
            case '===':
            case '==':
                return '='
            case '!==':
            case '!=':
                return '!='
            default:
                return operator
        }
    }
}