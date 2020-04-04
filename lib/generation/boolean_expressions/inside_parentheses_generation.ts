import {InsideParentheses} from '../../parsing/boolean_expressions/inside_parentheses'
import {generateBooleanExpression} from './boolean_expression_generation'
import {BooleanExpression} from '../../parsing/boolean_expressions/boolean_expression_parsing'

function generateInside(namedParameterPrefix: string, parameterNameToTableAlias: { [parameterName: string]: string }, inside: BooleanExpression): string {
    return generateBooleanExpression(namedParameterPrefix, parameterNameToTableAlias, inside)
}

export function generateInsideParentheses(namedParameterPrefix: string, parameterNameToTableAlias: { [parameterName: string]: string }, insideParentheses: InsideParentheses): string {
    return '(' + generateInside(namedParameterPrefix, parameterNameToTableAlias, insideParentheses.inside) + ')'
}