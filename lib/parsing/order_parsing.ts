import {extractLambdaString} from '../lambda_string_extraction'
import * as getParameterNames from 'get-parameter-names'
import {createNamedObjectPropertyParser} from './javascript_parsing'
import {Direction} from '../queries/one/sort_table'

export interface OrderExpression {
    table: string,
    property: string,
    direction: 'asc'|'desc'
}

function parseSortBy(sortBy: Function): [string, string] {
    const parameterNames = getParameterNames(sortBy)

    const parser = createNamedObjectPropertyParser(parameterNames)
        .map(([object, property]) => {
            return [`t${parameterNames.indexOf(object) + 1}`, property]
        })

    const lambdaString = extractLambdaString(sortBy)

    return parser.run(lambdaString).result
}

export function parseOrder(sortBy: Function, direction: Direction): OrderExpression {
    const [table, property] = parseSortBy(sortBy)

    return {
        table,
        property,
        direction
    }
}