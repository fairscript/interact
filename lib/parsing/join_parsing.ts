import {createGetColumn, GetColumn} from '../column_operations'
import {extractLambdaParametersAndExpression} from './javascript/lambda_parsing'
import {createNamedObjectPropertyParser} from './javascript/record_parsing'

export interface JoinExpression {
    tableName: string,
    left: GetColumn,
    right: GetColumn
}

function createOnParser(parameterNames: string[]) {
    const objectPropertyParser = createNamedObjectPropertyParser(parameterNames)

    const parser = objectPropertyParser
        .map(([object, property]) => createGetColumn(object, property))

    return parser
}

function parseSide(f: Function): GetColumn {
    const { parameters, expression } = extractLambdaParametersAndExpression(f)

    const parser = createOnParser(parameters)

    return parser.run(expression).result
}

export function parseJoin(
    tableName: string,
    left: Function,
    right: Function): JoinExpression {

    return {
        tableName,
        left: parseSide(left),
        right: parseSide(right)
    }
}