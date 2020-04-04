import {generateGetColumn} from '../get_column_generation'
import {generateGetProvided} from '../get_provided_generation'
import {Side} from '../../parsing/predicates/comparisons'
import {generateInsideParentheses} from './inside_parentheses_generation'
import {Literal} from '../../parsing/values/literal'

export function generateLiteral({value}: Literal): string {
    if (typeof value === 'string') {
        return "'" + value + "'"
    }
    else {
        return value.toString()
    }
}

export function generateSide(namedParameterPrefix: string, parameterNameToTableAlias: { [parameterName: string]: string }, side: Side): string {
    switch (side.kind) {
        case 'inside':
            return generateInsideParentheses(namedParameterPrefix, parameterNameToTableAlias, side)
        case 'get-column':
            return generateGetColumn(parameterNameToTableAlias, side)
        case 'get-provided':
            return generateGetProvided(namedParameterPrefix, side)
        case 'literal':
            return generateLiteral(side)
        case 'null':
            return 'NULL'
    }
}
