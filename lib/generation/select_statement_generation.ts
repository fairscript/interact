import {generateSelect} from './select_generation'
import {generateFrom} from './from_generation'
import {generateWhereParameters, generateWhereSql} from './where_generation'
import {generateOrderBy} from './ordering/order_by_generation'
import {GroupSelectStatement, SelectStatement} from '../select_statement'
import {generateGroupBy} from './group_by_generation'
import {generateInnerJoin} from './join_generation'
import {joinWithNewLine} from '../parsing/parsing_helpers'
import {Dialect} from '../databases/dialects'
import {StringValueRecord} from '../record'
import {generateLimit} from './limit_generation'
import {generateOffset} from './offset_generation'
import {generateGroupOrderBy} from './ordering/group_order_by_generation'


export function generateSelectStatementSql(dialect: Dialect, statement: SelectStatement|GroupSelectStatement): string {
    const {selection, distinct, tableName, filters, join, limit, offset} = statement

    const clauses = [
        generateSelect(dialect.aliasEscape, dialect.namedParameterPrefix, selection!, distinct),
        generateFrom(tableName)
    ]

    if (join !== null) {
        clauses.push(generateInnerJoin(join))
    }

    if (filters.length > 0) {
        clauses.push(generateWhereSql(dialect.namedParameterPrefix, filters))
    }

    switch (statement.kind) {
        case 'select-statement':
            if (statement.orders.length > 0) {
                clauses.push(generateOrderBy(statement.orders))
            }
            break
        case 'group-select-statement':
            clauses.push(generateGroupBy(statement.key))

            if (statement.orders.length > 0) {
                clauses.push(generateGroupOrderBy(statement.orders))
            }
            break
    }

    if (limit !== 'all') {
        clauses.push(generateLimit(limit))
    }

    if (offset > 0) {
        clauses.push(generateOffset(offset))
    }

    return joinWithNewLine(clauses)
}

export function generateSelectStatementParameters(dialect: Dialect, statement: SelectStatement|GroupSelectStatement): StringValueRecord {
    return generateWhereParameters(dialect.namedParameterPrefix, dialect.useNamedParameterPrefixInRecord, statement.filters)
}