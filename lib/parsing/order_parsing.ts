import {Direction} from '../queries/one/sort_table'
import {extractLambdaParametersAndExpression} from './javascript/lambda_parsing'
import {createNamedObjectPropertyParser} from './javascript/record_parsing'

export interface OrderExpression {
    table: string,
    property: string,
    direction: 'asc'|'desc'
}

function parseSortBy(sortBy: Function): [string, string] {
    const { parameters, expression } = extractLambdaParametersAndExpression(sortBy)

    const parser = createNamedObjectPropertyParser(parameters)
        .map(([object, property]) => {
            return [`t${parameters.indexOf(object) + 1}`, property]
        })

    return parser.run(expression).result
}

export function parseOrder(sortBy: Function, direction: Direction): OrderExpression {
    const [table, property] = parseSortBy(sortBy)

    return {
        table,
        property,
        direction
    }
}