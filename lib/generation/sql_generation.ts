import {generateSelect} from './select_generation'
import {generateFrom} from './from_generation'
import {generateWhere} from './where_generation'
import {generateOrderBy} from './order_by_generation'
import {joinWithNewLine} from '../parsing/javascript_parsing'
import {SelectStatement} from '../select_statement'
import {generateGroupBy} from './group_by_generation'

export function generateSql(statement: SelectStatement) {
    const {selection, tableName, predicates, key, orders} = statement

    const parts = [
        generateSelect(selection),
        generateFrom(tableName)
    ]

    if (predicates.length > 0) {
        parts.push(generateWhere(predicates))
    }

    if (key != null) {
        parts.push(generateGroupBy(key))
    }

    if (orders.length > 0) {
        parts.push(generateOrderBy(orders))
    }

    return joinWithNewLine(parts)
}