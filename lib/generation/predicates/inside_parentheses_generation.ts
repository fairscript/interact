import {InsideParentheses} from '../../parsing/predicates/inside_parentheses'
import {generatePredicate} from './predicate_generation'

export function generateInsideParentheses(namedParameterPrefix: string, parameterNameToTableAlias: { [parameterName: string]: string }, predicate: InsideParentheses): string {
    return '(' + generatePredicate(namedParameterPrefix, parameterNameToTableAlias, predicate.inside) + ')'
}