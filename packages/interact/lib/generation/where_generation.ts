import {Filter} from '../parsing/filtering/filter_parsing'
import {ValueRecord} from '../record'
import {generateBooleanExpression} from './boolean_expressions/boolean_expression_generation'
import {generateFilterParameters} from './filtering/filter_parameter_generation'


function generateWhereClause(namedParameterPrefix: string, filters: Filter[]): string {
    if (filters.length == 1) {
        const { tableParameterToTableAlias, booleanExpression } = filters[0]

        return generateBooleanExpression(namedParameterPrefix, tableParameterToTableAlias, booleanExpression)
    }
    else {
        return filters.map(f => generateBooleanExpression(namedParameterPrefix, f.tableParameterToTableAlias, f.booleanExpression))
            .map(sql => '(' + sql + ')')
            .join(' AND ')
    }
}

export function generateWhereSql(namedParameterPrefix: string, filters: Filter[]): string {
    return `WHERE ${generateWhereClause(namedParameterPrefix, filters)}`
}

export function generateWhereParameters(namedParameterPrefix: string, useNamedParameterPrefixInRecord: boolean, filters: Filter[]): ValueRecord {
    return filters
        .map(f => generateFilterParameters(namedParameterPrefix, useNamedParameterPrefixInRecord, f))
        .reduce(
            (acc, item) => {
                return {
                    ...acc,
                    ...item
                }
            },
            {}
        )
}