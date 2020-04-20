import {GroupOrderExpression} from '../../parsing/sorting/group_sorting_parsing'
import {generateDirection} from './order_by_generation'
import {generateGroupAggregationOperation} from '../aggregation/group_aggregation_operation_generation'
import {joinWithCommaWhitespace} from '../../join'
import {Key} from '../../parsing/get_key_parsing'

function generateGroupOrder(
    namedParameterPrefix: string,
    generateConvertToInt: (getColumn: string) => string,
    generateConvertToFloat: (getColumn: string) => string,
    key: Key,
    order: GroupOrderExpression): string {

    const { parameterNameToTableAlias, operation, direction } = order

    const generatedAggregationOperation = generateGroupAggregationOperation(namedParameterPrefix, generateConvertToInt, generateConvertToFloat, key, parameterNameToTableAlias, operation)
    const generatedDirection = generateDirection(direction)

    return `${generatedAggregationOperation} ${generatedDirection}`
}

function generateGroupOrders(
    namedParameterPrefix: string,
    generateConvertToInt: (getColumn: string) => string,
    generateConvertToFloat: (getColumn: string) => string,
    key: Key,
    orders: GroupOrderExpression[]): string {

    return joinWithCommaWhitespace(orders.map(order => generateGroupOrder(namedParameterPrefix, generateConvertToInt, generateConvertToFloat, key, order)))
}

export function generateGroupOrderBy(
    namedParameterPrefix: string,
    generateConvertToInt: (getColumn: string) => string,
    generateConvertToFloat: (getColumn: string) => string,
    key: Key,
    orders: GroupOrderExpression[]): string {
    return 'ORDER BY ' + generateGroupOrders(namedParameterPrefix, generateConvertToInt, generateConvertToFloat, key, orders)
}