import {generateSelect} from './select_generation'
import {generateFrom} from './from_generation'
import {generateWhere} from './where_generation'
import {generateOrderBy} from './order_by_generation'
import {SelectStatement} from '../select_statement'
import {generateGroupBy} from './group_by_generation'
import {generateInnerJoin} from './join_generation'
import {joinWithNewLine} from '../parsing/parsing_helpers'
import {StringValueRecord} from '../record'
import {Dialect} from '../dialects/dialects'

export function generateSql(dialect: Dialect, statement: SelectStatement): [string, StringValueRecord] {
    const {selection, tableName, filters, key, orders, join} = statement

    const clauses = [
        generateSelect(dialect, selection),
        generateFrom(tableName)
    ]
    let parameters = {}

    if (join !== null) {
        clauses.push(generateInnerJoin(join))
    }

    if (filters.length > 0) {
        const [whereSql, whereParameters] = generateWhere(dialect.namedParameterPrefix, dialect.useNamedParameterPrefixInRecord, filters)
        clauses.push(whereSql)
        parameters = {
            ...parameters,
            ...whereParameters
        }
    }

    if (key != null) {
        clauses.push(generateGroupBy(key))
    }

    if (orders.length > 0) {
        clauses.push(generateOrderBy(orders))
    }

    return [joinWithNewLine(clauses), parameters]
}