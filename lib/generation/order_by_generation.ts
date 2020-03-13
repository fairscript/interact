import {OrderExpression} from '../parsing/order_parsing'
import {joinWithCommaWhitespace} from '../parsing/javascript_parsing'
import * as toSnakeCase from 'js-snakecase'


function generateOrder(order: OrderExpression): string {
    return `t${order.table}.${toSnakeCase(order.column)} ${order.direction.toUpperCase()}`
}

function generateOrders(orders: Array<OrderExpression>): string {
    return joinWithCommaWhitespace(orders.map(generateOrder))

}

export function generateOrderBy(orders: Array<OrderExpression>): string {
    return 'ORDER BY ' + generateOrders(orders)
}