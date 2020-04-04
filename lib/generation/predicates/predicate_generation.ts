import {Predicate} from '../../parsing/predicates/predicate_parsing'
import {generateComparison} from './comparison_generation'
import {generateInsideParentheses} from './inside_parentheses_generation'
import {generateConcatenation} from './concatenation_generation'
import {generateConstant} from './side_generation'
import {generateGetColumn} from '../get_column_generation'
import {generateGetProvided} from '../get_provided_generation'
import {generateNegation} from './negation_generation'

export function generatePredicate(namedParameterPrefix: string, parameterNameToTableAlias: { [parameterName: string]: string }, predicate: Predicate): string {
    switch (predicate.kind) {
        case 'comparison':
            return generateComparison(namedParameterPrefix, parameterNameToTableAlias, predicate)
        case 'inside':
            return generateInsideParentheses(namedParameterPrefix, parameterNameToTableAlias, predicate)
        case 'concatenation':
            return generateConcatenation(namedParameterPrefix, parameterNameToTableAlias, predicate)
        case 'constant':
            return generateConstant(predicate)
        case 'get-column':
            return generateGetColumn(parameterNameToTableAlias, predicate)
        case 'get-provided':
            return generateGetProvided(namedParameterPrefix, predicate)
        case 'negation':
            return generateNegation(namedParameterPrefix, parameterNameToTableAlias, predicate)
    }
}