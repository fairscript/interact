import {InsideParentheses} from '../../parsing/booleanexpressions/inside_parentheses'
import {generatePredicate} from './predicate_generation'
import {BooleanExpression} from '../../parsing/booleanexpressions/boolean_expression_parsing'

function generateInside(namedParameterPrefix: string, parameterNameToTableAlias: { [parameterName: string]: string }, inside: BooleanExpression): string {
    return generatePredicate(namedParameterPrefix, parameterNameToTableAlias, inside)
}

export function generateInsideParentheses(namedParameterPrefix: string, parameterNameToTableAlias: { [parameterName: string]: string }, predicate: InsideParentheses): string {
    return '(' + generateInside(namedParameterPrefix, parameterNameToTableAlias, predicate.inside) + ')'
}