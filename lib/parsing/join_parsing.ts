import {createGetFromParameter, GetFromParameter} from '../column_operations'
import {parseLambdaFunction} from './lambda_parsing'
import {createNamedObjectPropertyParser} from './javascript/object_parsing'

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

function parseSide(f: Function): GetFromParameter {
    const { parameters, expression } = parseLambdaFunction(f)

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