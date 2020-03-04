import {createTableFieldParser, joinWithCommaWhitespace} from './parsing'
import {extractLambdaString} from './lambda_string'
import {By, Order} from '../queries/sorting'

function parseBy<T>(by: By<T>): string {
    const parser = createTableFieldParser(by)

    const lambdaString = extractLambdaString(by)

    return parser.run(lambdaString).result
}

function parseDirection(direction: 'asc'|'desc'): 'ASC'|'DESC' {
    return direction === 'asc' ? 'ASC' : 'DESC'
}

function parseOrder<T>(order: Order<T>): string {
    return `${parseBy(order.by)} ${(parseDirection(order.direction))}`
}

export function generateSortBy<T>(orders: Array<Order<T>>): string {
    return `ORDER BY ${joinWithCommaWhitespace(orders.map(parseOrder))}`
}