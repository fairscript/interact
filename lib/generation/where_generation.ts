import {generateGetColumn} from './get_column_generation'
import {Constant, GetProvided} from '../column_operations'
import {Filter, PredicateExpression} from '../parsing/filter_parsing'
import {Comparison, Side} from '../parsing/predicate/comparison'
import {Concatenation, TailItem} from '../parsing/predicate/concatenation'
import {InsideParentheses} from '../parsing/predicate/inside_parentheses'
import {joinWithWhitespace} from '../parsing/parsing_helpers'
import {generateGetProvided} from './get_provided_generation'
import {StringValueRecord, ValueOrNestedStringValueRecord} from '../record'


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
        case 'get-column':
            return generateGetColumn(parameterNameToTableAlias, side)
        case 'constant':
            return generateConstant(side)
        case 'get-provided':
            return generateGetProvided(side)
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

function getByPath(obj: {}, remainingPath: string[]): any {
    const current = obj[remainingPath[0]]

    if (remainingPath.length == 1) {
        return current
    }
    else {
        return getByPath(current, remainingPath.slice(1))
    }
}

function findGetProvided(expression: PredicateExpression, collection: GetProvided[] = []): GetProvided[] {
    switch (expression.kind) {
        case 'concatenation':
            const { head, tail } = expression

            return tail.reduce(
                (acc, tailItem) => findGetProvided(tailItem.expression, acc),
                findGetProvided(head, collection))

        case 'inside':
            return findGetProvided(expression.inside, collection)
        case 'comparison':
            const { left, right } = expression

            const comparisonItems = []

            if (left.kind === 'get-provided') {
                comparisonItems.push(left)
            }

            if (right.kind === 'get-provided') {
                comparisonItems.push(right)
            }

            return collection.concat(comparisonItems)
    }
}

function recordFilterParameters(
    predicate: PredicateExpression,
    userProvidedParameter: ValueOrNestedStringValueRecord): StringValueRecord {

    return findGetProvided(predicate).reduce(
        (acc, item) => {
            const key = generateGetProvided(item)
            const value = item.path.length === 0 ? userProvidedParameter: getByPath(userProvidedParameter, item.path)

            acc[key] = value

            return acc
        },
        {})
}

export function generateFilter(filter: Filter): [string, StringValueRecord] {
    const { tableParameterToTableAlias, predicate } = filter

    const sql = generatePredicate(tableParameterToTableAlias, predicate)

    const parameters = filter.kind === 'parameterless-filter'
        ? {}
        : recordFilterParameters(predicate, filter.userProvided)

    return [sql, parameters]
}

export function generateFilters(filters: Filter[]): [string, StringValueRecord] {
    if (filters.length == 1) {
        return generateFilter(filters[0])
    }
    else {
        const generatedFilters = filters.map(generateFilter)

        const combinedSql = generatedFilters
            .map(([sql, _]) => sql)
            .map(sql => '(' + sql + ')')
            .join(' AND ')

        const combinedParameters = generatedFilters
            .map(([_, parameters]) => parameters)
            .reduce(
                (acc, item) => {
                    return {
                        ...acc,
                        ...item
                    }
                },
                {}
            )

        return [combinedSql, combinedParameters]
    }
}

export function generateWhere(filters: Filter[]): [string, StringValueRecord] {
    const [predicateSql, parameters] = generateFilters(filters)

    return [`WHERE ${predicateSql}`, parameters]
}