import {OrderExpression} from '../../parsing/sorting/sorting_parsing'
import {generateGetColumn} from '../value_expressions/get_column_generation'
import {Direction} from '../../queries/one/sort_table'
import {joinWithCommaWhitespace} from '../../join'

export function generateDirection(direction: Direction): string {
    return direction.toUpperCase()
}

function generateOrder(order: OrderExpression): string {
    const { parameterNameToTableAlias, get, direction } = order

    const generatedGetColumn = generateGetColumn(parameterNameToTableAlias, get)
    const generatedDirection = generateDirection(direction)

    return `${generatedGetColumn} ${generatedDirection}`
}

function generateOrders(orders: OrderExpression[]): string {
    return joinWithCommaWhitespace(orders.map(generateOrder))
}

export function generateOrderBy(orders: OrderExpression[]): string {
    return 'ORDER BY ' + generateOrders(orders)
}