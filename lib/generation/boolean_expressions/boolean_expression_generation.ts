import {BooleanExpression} from '../../parsing/boolean_expressions/boolean_expression_parsing'
import {generateComparison} from './comparison_generation'
import {generateInsideParentheses} from './inside_parentheses_generation'
import {generateConcatenation} from './concatenation_generation'
import {generateGetColumn} from '../value_expressions/get_column_generation'
import {generateGetProvided} from '../value_expressions/get_provided_generation'
import {generateNegation} from './negation_generation'
import {generateLiteral} from '../value_expressions/literal_generation'

export function generateBooleanExpression(namedParameterPrefix: string, parameterNameToTableAlias: { [parameterName: string]: string }, expression: BooleanExpression): string {
    switch (expression.kind) {
        case 'comparison':
            return generateComparison(namedParameterPrefix, parameterNameToTableAlias, expression)
        case 'inside':
            return generateInsideParentheses(namedParameterPrefix, parameterNameToTableAlias, expression)
        case 'concatenation':
            return generateConcatenation(namedParameterPrefix, parameterNameToTableAlias, expression)
        case 'literal':
            return generateLiteral(expression)
        case 'get-column':
            return generateGetColumn(parameterNameToTableAlias, expression)
        case 'get-provided':
            return generateGetProvided(namedParameterPrefix, expression)
        case 'negation':
            return generateNegation(namedParameterPrefix, parameterNameToTableAlias, expression)
    }
}