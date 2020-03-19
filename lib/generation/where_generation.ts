import {joinWithWhitespace} from '../parsing/javascript_parsing'
import {generateGetFromParameter} from './get_from_parameter_generation'
import {Constant} from '../column_operations'
import {
    PredicateExpression
} from '../parsing/predicate_parsing'
import {Filter} from '../parsing/filter_parsing'
import {Comparison, Side} from '../parsing/predicate/comparison'
import {Concatenation, TailItem} from '../parsing/predicate/concatenation'
import {InsideParentheses} from '../parsing/predicate/inside_parentheses'


function generateConstant(constant: Constant): string {
    const value = constant.value
    if (typeof value === 'string') {
        return "'" + value +  "'"
    }
    else {
        return value.toString()
    }
}

function generateBinaryLogicalOperator(operator: '&&' | '||'): string {
    switch (operator) {
        case '&&':
            return 'AND'
        case '||':
            return 'OR'
    }
}

function generateTailItem(parameterNameToTableAlias: { [parameterName: string]: string }): (item: TailItem) => string {
    return item => {
        const binaryOperator = generateBinaryLogicalOperator(item.operator)
        const predicate = generatePredicate(parameterNameToTableAlias, item.expression)

        return `${binaryOperator} ${predicate}`
    }
}

function generateSide(parameterNameToTableAlias: { [parameterName: string]: string }, side: Side): string {
    switch (side.kind) {
        case 'get-from-parameter':
            return generateGetFromParameter(parameterNameToTableAlias, side)
        case 'constant':
            return generateConstant(side)
    }
}

function generateComparison(parameterNameToTableAlias: { [parameterName: string]: string }, predicate: Comparison): string {
    return `${generateSide(parameterNameToTableAlias, predicate.left)} ${predicate.operator} ${generateSide(parameterNameToTableAlias, predicate.right)}`
}

function generateInsideParentheses(parameterNameToTableAlias: { [parameterName: string]: string }, predicate: InsideParentheses): string {
    return '(' + generatePredicate(parameterNameToTableAlias, predicate.inside) + ')'
}

function generateConcatenation(parameterNameToTableAlias: { [parameterName: string]: string }, predicate: Concatenation): string {
    const head = generatePredicate(parameterNameToTableAlias, predicate.head)

    return joinWithWhitespace([head].concat(predicate.tail.map(generateTailItem(parameterNameToTableAlias))))
}

function generatePredicate(parameterNameToTableAlias: { [parameterName: string]: string }, predicate: PredicateExpression): string {
    switch (predicate.kind) {
        case 'comparison':
            return generateComparison(parameterNameToTableAlias, predicate)
        case 'inside':
            return generateInsideParentheses(parameterNameToTableAlias, predicate)
        case 'concatenation':
            return generateConcatenation(parameterNameToTableAlias, predicate)
    }
}

export function generateFilter(filter: Filter): string {
    const { parameterToTable, predicate } = filter

    return generatePredicate(parameterToTable, predicate)
}

export function generateFilters(filters: Filter[]): string {
    if (filters.length == 1) {
        return generateFilter(filters[0])
    }
    else {
        return filters.map(generateFilter).map(sql => '(' + sql + ')').join(' AND ')
    }
}

export function generateWhere(filters: Filter[]): string {
    return `WHERE ${generateFilters(filters)}`
}