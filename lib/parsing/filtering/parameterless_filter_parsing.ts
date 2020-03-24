import {extractLambdaParametersAndExpression} from '../javascript/lambda_parsing'
import {
    createConstantOrColumnSideParser,
    createPredicateExpressionParser,
    Filter, parsePredicate,
    PredicateExpression
} from '../filter_parsing'
import {mapParameterNamesToTableAliases} from '../../generation/table_aliases'

export function parseParameterlessPredicate(tableParameters: string[], expression: string): PredicateExpression {
    const sideParser = createConstantOrColumnSideParser(tableParameters)

    const parser = createPredicateExpressionParser(sideParser)

    return parsePredicate(parser, expression)
}

export function createParameterlessFilter(tableParameterToTableAlias: { [p: string]: string }, predicate: PredicateExpression): Filter {
    return {
        tableParameterToTableAlias,
        predicate,
        parameters: {}
    }
}

export function parseParameterlessFilter(f: Function): Filter {
    const { parameters, expression } = extractLambdaParametersAndExpression(f)

    const tableParameterToTableAlias = mapParameterNamesToTableAliases(parameters)
    const predicate = parseParameterlessPredicate(parameters, expression)

    return createParameterlessFilter(tableParameterToTableAlias, predicate)
}