import {createGet, Get, TableIndex} from '../column_operations'
import {createObjectPropertyParser} from './javascript_parsing'
import * as getParameterNames from 'get-parameter-names'
import {extractLambdaString} from '../lambda_string_extraction'

export interface JoinExpression {
    tableName: string,
    left: Get,
    right: Get
}

function createOnParser(parameterNames: string[], tableIndex: TableIndex) {
    const objectPropertyParser = createObjectPropertyParser(parameterNames)

    const parser = objectPropertyParser
        .map(([object, property]) => createGet(tableIndex, property))

    return parser
}

function parseSide<T, K1>(f: (table: T) => K1, tableIndex: TableIndex): Get {
    const parameterNames = getParameterNames(f)
    const parser = createOnParser(parameterNames, tableIndex)

    const lambdaString = extractLambdaString(f)

    return parser.run(lambdaString).result
}

export function parseJoin<T1, T2, K1>(
    tableName: string,
    left: (firstTable: T1) => K1,
    right: (secondTable: T2) => K1): JoinExpression {

    return {
        tableName,
        left: parseSide(left, 1),
        right: parseSide(right, 2)
    }
}