import {Concatenation, TailItem} from '../../parsing/boolean_expressions/concatenation'
import {joinWithWhitespace} from '../../parsing/parsing_helpers'
import {generateBooleanExpression} from './boolean_expression_generation'

function generateBinaryLogicalOperator(operator: '&&' | '||'): string {
    switch (operator) {
        case '&&':
            return 'AND'
        case '||':
            return 'OR'
    }
}

function generateTailItem(namedParameterPrefix: string, parameterNameToTableAlias: { [parameterName: string]: string }): (item: TailItem) => string {
    return item => {
        const binaryOperator = generateBinaryLogicalOperator(item.operator)
        const booleanExpression = generateBooleanExpression(namedParameterPrefix, parameterNameToTableAlias, item.expression)

        return `${binaryOperator} ${booleanExpression}`
    }
}

export function generateConcatenation(namedParameterPrefix: string, parameterNameToTableAlias: { [parameterName: string]: string }, concatenation: Concatenation): string {
    const head = generateBooleanExpression(namedParameterPrefix, parameterNameToTableAlias, concatenation.head)

    return joinWithWhitespace([head].concat(concatenation.tail.map(generateTailItem(namedParameterPrefix, parameterNameToTableAlias))))
}