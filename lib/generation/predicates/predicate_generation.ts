import {Predicate} from '../../parsing/predicates/predicate_parsing'
import {generateComparison} from './comparison_generation'
import {generateInsideParentheses} from './inside_parentheses_generation'
import {generateConcatenation} from './concatenation_generation'

export function generatePredicate(namedParameterPrefix: string, parameterNameToTableAlias: { [parameterName: string]: string }, predicate: Predicate): string {
    switch (predicate.kind) {
        case 'comparison':
            return generateComparison(namedParameterPrefix, parameterNameToTableAlias, predicate)
        case 'inside':
            return generateInsideParentheses(namedParameterPrefix, parameterNameToTableAlias, predicate)
        case 'concatenation':
            return generateConcatenation(namedParameterPrefix, parameterNameToTableAlias, predicate)
    }
}