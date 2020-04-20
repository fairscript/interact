import {generateFrom} from './from_generation'
import {generateWhereParameters, generateWhereSql} from './where_generation'
import {generateOrderBy} from './sorting/order_by_generation'
import {generateGroupBy} from './group_by_generation'
import {generateJoins} from './join_generation'
import {Dialect} from '../databases/dialects'
import {ValueRecord} from '../record'
import {generateLimit} from './limit_generation'
import {generateOffset} from './offset_generation'
import {generateGroupOrderBy} from './sorting/group_order_by_generation'
import {SelectStatement} from '../statements/select_statement'
import {GroupSelectStatement} from '../statements/group_select_statement'
import {joinWithNewLine} from '../join'
import {generateGroupSelect, generateTableSelect} from './select_generation'


export function generateSelectStatementSql(dialect: Dialect, statement: SelectStatement|GroupSelectStatement): string {
    const {distinct, tableName, filters, joins, limit, offset} = statement

    const clauses: string[] = []

    const {aliasEscape, namedParameterPrefix, generateConvertToInteger, generateConvertToFloat} = dialect

    switch (statement.kind) {
        case 'select-statement':
            clauses.push(generateTableSelect(distinct, aliasEscape, namedParameterPrefix, generateConvertToInteger, generateConvertToFloat, statement.selection!, statement.columns, statement.joins.map(j => j.columns)))
            break
        case 'group-select-statement':
            clauses.push(generateGroupSelect(distinct, aliasEscape, namedParameterPrefix, generateConvertToInteger, generateConvertToFloat, statement.selection!, statement.key))
            break
    }

    clauses.push(generateFrom(tableName))

    if (joins.length > 0) {
        clauses.push(...generateJoins(joins))
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
            const {key, orders} = statement
            clauses.push(generateGroupBy(key))

            if (orders.length > 0) {
                clauses.push(generateGroupOrderBy(namedParameterPrefix, generateConvertToInteger, generateConvertToFloat, key, orders))
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

export function generateSelectStatementParameters(dialect: Dialect, statement: SelectStatement|GroupSelectStatement): ValueRecord {
    return generateWhereParameters(dialect.namedParameterPrefix, dialect.useNamedParameterPrefixInRecord, statement.filters)
}