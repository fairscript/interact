import {OrderExpression} from '../parsing/order_parsing'
import {joinWithCommaWhitespace} from '../parsing/javascript_parsing'
import * as toSnakeCase from 'js-snakecase'

export function generateOrderBy(orders: Array<OrderExpression>) {
    const items = orders.map(expr => `t1.${toSnakeCase(expr.property)} ${expr.direction.toUpperCase()}`)

    return 'ORDER BY ' + joinWithCommaWhitespace(items)
}