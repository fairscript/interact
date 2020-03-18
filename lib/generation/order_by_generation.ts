import {OrderExpression} from '../parsing/order_parsing'
import {joinWithCommaWhitespace} from '../parsing/javascript_parsing'
import * as toSnakeCase from 'js-snakecase'


function generateOrder(order: OrderExpression): string {
    return `${order.table}.${toSnakeCase(order.property)} ${order.direction.toUpperCase()}`
}

function generateOrders(orders: OrderExpression[]): string {
    return joinWithCommaWhitespace(orders.map(generateOrder))

}

export function generateOrderBy(orders: OrderExpression[]): string {
    return 'ORDER BY ' + generateOrders(orders)
}