import {OrderExpression} from '../parsing/order_parsing'
import {joinWithCommaWhitespace} from '../parsing/parsing_helpers'
import {generateGetColumn} from './get_column_generation'
import {GetColumn} from '../column_operations'
import {AggregateColumn} from '../parsing/selection/aggregation_parsing'
import {generateAggregateColumn} from './selection/aggregation_selection_generation'

function generateOrderOperation(parameterNameToTableAlias: {[parameter: string]: string}, operation: GetColumn|AggregateColumn) {
    switch (operation.kind) {
        case 'aggregate-column':
            return generateAggregateColumn(parameterNameToTableAlias, operation.aggregation, operation.get.object, operation.get.property)
        case 'get-column':
            return generateGetColumn(parameterNameToTableAlias, operation)
    }
}

function generateDirection(direction: 'asc'|'desc'): string {
    return direction.toUpperCase()
}

function generateOrder(order: OrderExpression): string {
    const { parameterNameToTableAlias, operation, direction } = order

    const generatedOperation = generateOrderOperation(parameterNameToTableAlias, operation)
    const generatedDirection = generateDirection(direction)

    return `${generatedOperation} ${generatedDirection}`
}

function generateOrders(orders: OrderExpression[]): string {
    return joinWithCommaWhitespace(orders.map(generateOrder))
}

export function generateOrderBy(orders: OrderExpression[]): string {
    return 'ORDER BY ' + generateOrders(orders)
}