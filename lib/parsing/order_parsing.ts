import {extractLambdaString} from '../lambda_string_extraction'
import * as getParameterNames from 'get-parameter-names'
import {By, Order} from '../table'
import {createObjectPropertyParser} from './javascript_parsing'

export interface OrderExpression {
    object: string,
    property: string,
    direction: 'asc'|'desc'
}

function parseBy<T>(by: By<T>): [string, string] {
    const parameterNames = getParameterNames(by)

    const parser = createObjectPropertyParser(parameterNames)

    const lambdaString = extractLambdaString(by)

    return parser.run(lambdaString).result
}

export function parseOrder<T>(order: Order<T>): OrderExpression {
    const [object, property] = parseBy(order.by)

    return {
        object,
        property,
        direction: order.direction
    }
}