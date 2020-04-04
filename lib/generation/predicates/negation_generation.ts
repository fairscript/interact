import {Negatable, Negation} from '../../parsing/booleanexpressions/negation_parsing'
import {generateInsideParentheses} from './inside_parentheses_generation'
import {generateLiteral} from './value_expression_generation'
import {generateGetColumn} from '../get_column_generation'
import {generateGetProvided} from '../get_provided_generation'

export function generateNegated(namedParameterPrefix: string, parameterNameToTableAlias: { [parameterName: string]: string }, negated: Negatable) {
    switch (negated.kind) {
        case 'literal':
            return generateLiteral(negated)
        case 'get-column':
            return generateGetColumn(parameterNameToTableAlias, negated)
        case 'get-provided':
            return generateGetProvided(namedParameterPrefix, negated)
        case 'inside':
            return generateInsideParentheses(namedParameterPrefix, parameterNameToTableAlias, negated)
    }
}

export function generateNegation(namedParameterPrefix: string, parameterNameToTableAlias: { [parameterName: string]: string }, { negated }: Negation) {
    const generatedNegated = generateNegated(namedParameterPrefix, parameterNameToTableAlias, negated)

    if (negated.kind === 'inside') {
        return generatedNegated
    }
    else {
        return `(${generatedNegated})`
    }
}