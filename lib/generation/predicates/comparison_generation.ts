import {Comparison} from '../../parsing/predicates/comparisons'
import {generateSide} from './side_generation'
import {SqlComparisonOperator} from '../../parsing/predicates/comparison_operators'

export function generateComparison(namedParameterPrefix: string, parameterNameToTableAlias: { [parameterName: string]: string }, predicate: Comparison): string {
    const {left, operator, right}: Comparison = predicate

    const generatedLeft = generateSide(namedParameterPrefix, parameterNameToTableAlias, left)
    const generatedOperator = generateOperator(operator, right.kind === 'null')
    const generatedRight = generateSide(namedParameterPrefix, parameterNameToTableAlias, right)

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