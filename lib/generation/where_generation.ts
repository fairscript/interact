import {ObjectProperty, PredicateExpression, TailItem, Value} from '../parsing/predicate_parsing'
import {joinWithWhitespace} from '../parsing/javascript_parsing'
import * as toSnakeCase from 'js-snakecase'


function generateObjectProperty(objectProperty: ObjectProperty) {
    return `t1.${toSnakeCase(objectProperty.property)}`
}

function generateComparisonOperator(operator: '=') {
    return '='
}

function generateValue(value: Value) {
    if (typeof value === 'string') {
        return "'" + value +  "'"
    }
    else {
        return value.toString()
    }
}

function generateBinaryLogicalOperator(operator: '&&' | '||') {
    switch (operator) {
        case '&&':
            return 'AND'
        case '||':
            return 'OR'
    }
}

function generateTailItem(item: TailItem) {
    return `${generateBinaryLogicalOperator(item.operator)} ${generatePredicate(item.expression)}`
}

function generatePredicate(predicate: PredicateExpression): string {
    switch (predicate.kind) {
        case 'comparison':
            return `${generateObjectProperty(predicate.left)} ${generateComparisonOperator(predicate.operator)} ${generateValue(predicate.right)}`
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