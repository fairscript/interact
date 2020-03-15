import {PredicateExpression, TailItem} from '../parsing/predicate_parsing'
import {joinWithWhitespace} from '../parsing/javascript_parsing'
import {generateGet} from './column_generation'
import {Value} from '../value'


function generateComparisonOperator(operator: '='): string {
    return '='
}

function generateValue(value: Value): string {
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

function generatePredicate(predicate: PredicateExpression): string {
    switch (predicate.kind) {
        case 'comparison':
            return `${generateGet(predicate.left)} ${generateComparisonOperator(predicate.operator)} ${generateValue(predicate.right)}`
        case 'inside':
            return '(' + generatePredicate(predicate.inside) + ')'
        case 'concatenation':
            const head = generatePredicate(predicate.head)

            return joinWithWhitespace([head].concat(predicate.tail.map(generateTailItem)))
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