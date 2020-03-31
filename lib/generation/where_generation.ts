import {generateGetColumn} from './get_column_generation'
import {GetProvided} from '../parsing/get_provided'
import {Filter} from '../parsing/filtering/filter_parsing'
import {Concatenation, TailItem} from '../parsing/predicates/concatenation'
import {InsideParentheses} from '../parsing/predicates/inside_parentheses'
import {joinWithWhitespace} from '../parsing/parsing_helpers'
import {computePlaceholderName, generateGetProvided} from './get_provided_generation'
import {ValueRecord, ValueOrNestedValueRecord} from '../record'
import {Comparison, Side} from '../parsing/predicates/comparisons'
import {Predicate} from '../parsing/predicates/predicate_parsing'
import {Constant} from '../parsing/predicates/side_parsing'


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

function generateTailItem(namedParameterPrefix: string, parameterNameToTableAlias: { [parameterName: string]: string }): (item: TailItem) => string {
    return item => {
        const binaryOperator = generateBinaryLogicalOperator(item.operator)
        const predicate = generatePredicate(namedParameterPrefix, parameterNameToTableAlias, item.expression)

        return `${binaryOperator} ${predicate}`
    }
}

function generateSide(namedParameterPrefix: string, parameterNameToTableAlias: { [parameterName: string]: string }, side: Side): string {
    switch (side.kind) {
        case 'get-column':
            return generateGetColumn(parameterNameToTableAlias, side)
        case 'constant':
            return generateConstant(side)
        case 'get-provided':
            return generateGetProvided(namedParameterPrefix, side)
    }
}

function generateComparison(namedParameterPrefix: string, parameterNameToTableAlias: { [parameterName: string]: string }, predicate: Comparison): string {
    return `${generateSide(namedParameterPrefix, parameterNameToTableAlias, predicate.left)} ${predicate.operator} ${generateSide(namedParameterPrefix, parameterNameToTableAlias, predicate.right)}`
}

function generateInsideParentheses(namedParameterPrefix: string, parameterNameToTableAlias: { [parameterName: string]: string }, predicate: InsideParentheses): string {
    return '(' + generatePredicate(namedParameterPrefix, parameterNameToTableAlias, predicate.inside) + ')'
}

function generateConcatenation(namedParameterPrefix: string, parameterNameToTableAlias: { [parameterName: string]: string }, predicate: Concatenation): string {
    const head = generatePredicate(namedParameterPrefix, parameterNameToTableAlias, predicate.head)

    return joinWithWhitespace([head].concat(predicate.tail.map(generateTailItem(namedParameterPrefix, parameterNameToTableAlias))))
}

function generatePredicate(namedParameterPrefix: string, parameterNameToTableAlias: { [parameterName: string]: string }, predicate: Predicate): string {
    switch (predicate.kind) {
        case 'comparison':
            return generateComparison(namedParameterPrefix, parameterNameToTableAlias, predicate)
        case 'inside':
            return generateInsideParentheses(namedParameterPrefix, parameterNameToTableAlias, predicate)
        case 'concatenation':
            return generateConcatenation(namedParameterPrefix, parameterNameToTableAlias, predicate)
    }
}

function generateWhereClause(namedParameterPrefix: string, filters: Filter[]): string {
    if (filters.length == 1) {
        const { tableParameterToTableAlias, predicate } = filters[0]

        return generatePredicate(namedParameterPrefix, tableParameterToTableAlias, predicate)
    }
    else {
        return filters.map(f => generatePredicate(namedParameterPrefix, f.tableParameterToTableAlias, f.predicate))
            .map(sql => '(' + sql + ')')
            .join(' AND ')
    }
}

export function generateWhereSql(namedParameterPrefix: string, filters: Filter[]): string {
    return `WHERE ${generateWhereClause(namedParameterPrefix, filters)}`
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

function findGetProvided(expression: Predicate, collection: GetProvided[] = []): GetProvided[] {
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

            const comparisonItems: GetProvided[] = []

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
    namedParameterPrefix: string,
    useNamedParameterPrefixInRecord: boolean,
    predicate: Predicate,
    userProvidedParameter: ValueOrNestedValueRecord): ValueRecord {

    return findGetProvided(predicate).reduce(
        (acc, item) => {
            const key = (useNamedParameterPrefixInRecord ? namedParameterPrefix : '') + computePlaceholderName(item)
            const value = item.path.length === 0 ? userProvidedParameter: getByPath(userProvidedParameter, item.path)

            acc[key] = value

            return acc
        },
        {})
}

function generateFilterParameters(namedParameterPrefix: string, useNamedParameterPrefixInRecord: boolean, filter: Filter): ValueRecord {
    return filter.kind === 'parameterless-filter'
        ? {}
        : recordFilterParameters(namedParameterPrefix, useNamedParameterPrefixInRecord, filter.predicate, filter.userProvided)
}

export function generateWhereParameters(namedParameterPrefix: string, useNamedParameterPrefixInRecord: boolean, filters: Filter[]): ValueRecord {
    return filters
        .map(f => generateFilterParameters(namedParameterPrefix, useNamedParameterPrefixInRecord, f))
        .reduce(
            (acc, item) => {
                return {
                    ...acc,
                    ...item
                }
            },
            {}
        )
}