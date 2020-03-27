import {generateSelect} from './select_generation'
import {generateFrom} from './from_generation'
import {generateWhereParameters, generateWhereSql} from './where_generation'
import {generateOrderBy} from './order_by_generation'
import {SelectStatement} from '../select_statement'
import {generateGroupBy} from './group_by_generation'
import {generateInnerJoin} from './join_generation'
import {joinWithNewLine} from '../parsing/parsing_helpers'
import {Dialect} from '../databases/dialects'
import {StringValueRecord} from '../record'
import {generateLimit} from './limit_generation'


export function generateSelectStatementSql(dialect: Dialect, statement: SelectStatement): string {
    const {selection, tableName, filters, key, orders, join, limit} = statement

    const clauses = [
        generateSelect(dialect.aliasEscape, dialect.namedParameterPrefix, selection!),
        generateFrom(tableName)
    ]

    if (join !== null) {
        clauses.push(generateInnerJoin(join))
    }

    if (filters.length > 0) {
        clauses.push(generateWhereSql(dialect.namedParameterPrefix, filters))
    }

    if (key !== null) {
        clauses.push(generateGroupBy(key))
    }

    if (orders.length > 0) {
        clauses.push(generateOrderBy(orders))
    }

    if (limit !== 'all') {
        clauses.push(generateLimit(limit))
    }

    return joinWithNewLine(clauses)
}

export function generateSelectStatementParameters(dialect: Dialect, statement: SelectStatement): StringValueRecord {
    return generateWhereParameters(dialect.namedParameterPrefix, dialect.useNamedParameterPrefixInRecord, statement.filters)
}