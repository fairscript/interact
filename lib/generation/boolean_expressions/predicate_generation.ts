import {BooleanExpression} from '../../parsing/boolean_expressions/boolean_expression_parsing'
import {generateComparison} from './comparison_generation'
import {generateInsideParentheses} from './inside_parentheses_generation'
import {generateConcatenation} from './concatenation_generation'
import {generateGetColumn} from '../value_expressions/get_column_generation'
import {generateGetProvided} from '../value_expressions/get_provided_generation'
import {generateNegation} from './negation_generation'
import {generateLiteral} from '../value_expressions/literal_generation'

export function generatePredicate(namedParameterPrefix: string, parameterNameToTableAlias: { [parameterName: string]: string }, predicate: BooleanExpression): string {
    switch (predicate.kind) {
        case 'comparison':
            return generateComparison(namedParameterPrefix, parameterNameToTableAlias, predicate)
        case 'inside':
            return generateInsideParentheses(namedParameterPrefix, parameterNameToTableAlias, predicate)
        case 'concatenation':
            return generateConcatenation(namedParameterPrefix, parameterNameToTableAlias, predicate)
        case 'literal':
            return generateLiteral(predicate)
        case 'get-column':
            return generateGetColumn(parameterNameToTableAlias, predicate)
        case 'get-provided':
            return generateGetProvided(namedParameterPrefix, predicate)
        case 'negation':
            return generateNegation(namedParameterPrefix, parameterNameToTableAlias, predicate)
    }
}