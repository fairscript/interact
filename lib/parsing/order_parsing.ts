import {extractLambdaString} from '../lambda_string_extraction'
import * as getParameterNames from 'get-parameter-names'
import {createObjectPropertyParser} from './javascript_parsing'
import {Value} from '../column_operations'
import {Order} from '../queries/sort_table'

export interface OrderExpression {
    object: string,
    property: string,
    direction: 'asc'|'desc'
}

function parseSortBy<T>(sortBy: (table: T) => Value): [string, string] {
    const parameterNames = getParameterNames(sortBy)

    const parser = createObjectPropertyParser(parameterNames)

    const lambdaString = extractLambdaString(sortBy)

    return parser.run(lambdaString).result
}

export function parseOrder<T>(order: Order<T>): OrderExpression {
    const [object, property] = parseSortBy(order.sortBy)

    return {
        object,
        property,
        direction: order.direction
    }
}