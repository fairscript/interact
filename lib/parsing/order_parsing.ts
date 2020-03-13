import {extractLambdaString} from '../lambda_string_extraction'
import * as getParameterNames from 'get-parameter-names'
import {createObjectPropertyParser} from './javascript_parsing'
import {Direction} from '../queries/sort_table'
import {createFindTableIndex} from './table_index'
import {TableIndex} from '../column_operations'

export interface OrderExpression {
    table: TableIndex,
    column: string,
    direction: 'asc'|'desc'
}

function parseSortBy<T>(sortBy: Function): [TableIndex, string] {
    const parameterNames = getParameterNames(sortBy)

    const findTableIndex = createFindTableIndex(parameterNames)

    const parser = createObjectPropertyParser(parameterNames)
        .map(([object, property]) => {
            return [findTableIndex(object), property]
        })

    const lambdaString = extractLambdaString(sortBy)

    return parser.run(lambdaString).result
}

export function parseOrder<T>(sortBy: Function, direction: Direction): OrderExpression {
    const [table, column] = parseSortBy(sortBy)

    return {
        table,
        column,
        direction
    }
}