import {OrderExpression} from '../parsing/order_parsing'
import {joinWithCommaWhitespace} from '../parsing/javascript_parsing'
import {generateColumnAccess} from './column_access_generation'


function generateOrder(order: OrderExpression): string {
    return `${generateColumnAccess(order.table, order.property)} ${order.direction.toUpperCase()}`
}

function generateOrders(orders: OrderExpression[]): string {
    return joinWithCommaWhitespace(orders.map(generateOrder))

}

export function generateOrderBy(orders: OrderExpression[]): string {
    return 'ORDER BY ' + generateOrders(orders)
}