import {createGetFromParameter, GetFromParameter} from '../column_operations'
import {createNamedObjectPropertyParser} from './javascript_parsing'
import * as getParameterNames from 'get-parameter-names'
import {extractLambdaString} from '../lambda_string_extraction'

export interface JoinExpression {
    tableName: string,
    left: GetFromParameter,
    right: GetFromParameter
}

function createOnParser(parameterNames: string[]) {
    const objectPropertyParser = createNamedObjectPropertyParser(parameterNames)

    const parser = objectPropertyParser
        .map(([object, property]) => createGetFromParameter(object, property))

    return parser
}

function parseSide<T, K1>(f: (table: T) => K1): GetFromParameter {
    const parameterNames = getParameterNames(f)
    const parser = createOnParser(parameterNames)

    const lambdaString = extractLambdaString(f)

    return parser.run(lambdaString).result
}

export function parseJoin<T1, T2, K1>(
    tableName: string,
    left: (firstTable: T1) => K1,
    right: (secondTable: T2) => K1): JoinExpression {

    return {
        tableName,
        left: parseSide(left),
        right: parseSide(right)
    }
}