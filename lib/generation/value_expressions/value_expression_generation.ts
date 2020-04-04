import {generateGetColumn} from './get_column_generation'
import {generateGetProvided} from './get_provided_generation'
import {ValueExpression} from '../../parsing/boolean_expressions/comparisons'
import {generateInsideParentheses} from '../boolean_expressions/inside_parentheses_generation'
import {generateLiteral} from './literal_generation'

export function generateValueExpression(namedParameterPrefix: string, parameterNameToTableAlias: { [parameterName: string]: string }, expression: ValueExpression): string {
    switch (expression.kind) {
        case 'inside':
            return generateInsideParentheses(namedParameterPrefix, parameterNameToTableAlias, expression)
        case 'get-column':
            return generateGetColumn(parameterNameToTableAlias, expression)
        case 'get-provided':
            return generateGetProvided(namedParameterPrefix, expression)
        case 'literal':
            return generateLiteral(expression)
        case 'null':
            return 'NULL'
    }
}
