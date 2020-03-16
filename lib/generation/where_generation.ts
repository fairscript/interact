import {
    Comparison,
    Concatenation,
    InsideParentheses,
    PredicateExpression, Side,
    TailItem
} from '../parsing/predicate_parsing'
import {joinWithWhitespace} from '../parsing/javascript_parsing'
import {generateGet} from './column_generation'
import {Constant} from '../column_operations'


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

function generateTailItem(item: TailItem): string {
    return `${generateBinaryLogicalOperator(item.operator)} ${generatePredicate(item.expression)}`
}

function generateSide(side: Side): string {
    switch (side.kind) {
        case 'get':
            return generateGet(side)
        case 'constant':
            return generateConstant(side)
    }
}

function generateComparison(predicate: Comparison): string {
    return `${generateSide(predicate.left)} ${predicate.operator} ${generateSide(predicate.right)}`
}

function generateInsideParentheses(predicate: InsideParentheses): string {
    return '(' + generatePredicate(predicate.inside) + ')'
}

function generateConcatenation(predicate: Concatenation): string {
    const head = generatePredicate(predicate.head)

    return joinWithWhitespace([head].concat(predicate.tail.map(generateTailItem)))
}

function generatePredicate(predicate: PredicateExpression): string {
    switch (predicate.kind) {
        case 'comparison':
            return generateComparison(predicate)
        case 'inside':
            return generateInsideParentheses(predicate)
        case 'concatenation':
            return generateConcatenation(predicate)
    }
}

function generatePredicates(predicates: Array<PredicateExpression>): string {
    if (predicates.length == 1) {
        return generatePredicate(predicates[0])
    }
    else {
        return predicates.map(generatePredicate).map(sql => '(' + sql + ')').join(' AND ')
    }
}

export function generateWhere(predicates: Array<PredicateExpression>): string {
    return `WHERE ${generatePredicates(predicates)}`
}