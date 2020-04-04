import {InsideParentheses} from '../../parsing/predicates/inside_parentheses'
import {generatePredicate} from './predicate_generation'
import {Predicate} from '../../parsing/predicates/predicate_parsing'

function generateInside(namedParameterPrefix: string, parameterNameToTableAlias: { [parameterName: string]: string }, inside: Predicate): string {
    return generatePredicate(namedParameterPrefix, parameterNameToTableAlias, inside)
}

export function generateInsideParentheses(namedParameterPrefix: string, parameterNameToTableAlias: { [parameterName: string]: string }, predicate: InsideParentheses): string {
    return '(' + generateInside(namedParameterPrefix, parameterNameToTableAlias, predicate.inside) + ')'
}