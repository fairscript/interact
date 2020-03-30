import {joinWithCommaWhitespace} from '../../parsing/parsing_helpers'
import {GroupOrderExpression} from '../../parsing/sorting/group_sorting_parsing'
import {generateGroupAggregationOperation} from '../selection/group_aggregation_selection_generation'
import {generateDirection} from './order_by_generation'

function generateGroupOrder(order: GroupOrderExpression): string {
    const { partOfKeyToTableAndProperty, parameterNameToTableAlias, operation, direction } = order

    const generatedAggregationOperation = generateGroupAggregationOperation(partOfKeyToTableAndProperty, parameterNameToTableAlias, operation)
    const generatedDirection = generateDirection(direction)

    return `${generatedAggregationOperation} ${generatedDirection}`
}

function generateGroupOrders(orders: GroupOrderExpression[]): string {
    return joinWithCommaWhitespace(orders.map(generateGroupOrder))
}

export function generateGroupOrderBy(orders: GroupOrderExpression[]): string {
    return 'ORDER BY ' + generateGroupOrders(orders)
}