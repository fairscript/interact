import {Concatenation, TailItem} from '../../parsing/booleanexpressions/concatenation'
import {joinWithWhitespace} from '../../parsing/parsing_helpers'
import {generatePredicate} from './predicate_generation'

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
        const predicate = generatePredicate(namedParameterPrefix, parameterNameToTableAlias, item.expression)

        return `${binaryOperator} ${predicate}`
    }
}

export function generateConcatenation(namedParameterPrefix: string, parameterNameToTableAlias: { [parameterName: string]: string }, predicate: Concatenation): string {
    const head = generatePredicate(namedParameterPrefix, parameterNameToTableAlias, predicate.head)

    return joinWithWhitespace([head].concat(predicate.tail.map(generateTailItem(namedParameterPrefix, parameterNameToTableAlias))))
}