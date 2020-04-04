import {extractLambdaParametersAndExpression} from './javascript/lambda_parsing'
import {createGetColumnParser, GetColumn} from './valuexpressions/get_column_parsing'

export interface JoinExpression {
    tableName: string,
    left: GetColumn,
    right: GetColumn
}

function parseSide(f: Function): GetColumn {
    const { parameters, expression } = extractLambdaParametersAndExpression(f)

    const parser = createGetColumnParser(parameters)

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