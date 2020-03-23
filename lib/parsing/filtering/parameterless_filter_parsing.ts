import {extractLambdaParametersAndExpression} from '../javascript/lambda_parsing'
import {
    createConstantOrColumnSideParser,
    createFilter, createPredicateExpressionParser,
    Filter, parsePredicate,
    PredicateExpression
} from '../filter_parsing'
import {mapParameterNamesToTableAliases} from '../../generation/table_aliases'

export function parseParameterlessPredicate(tableParameters: string[], expression: string): PredicateExpression {
    const parser = createPredicateExpressionParser(createConstantOrColumnSideParser(tableParameters))

    return parsePredicate(parser, expression)
}

export function parseParameterlessFilter(f: Function): Filter {
    const { parameters, expression } = extractLambdaParametersAndExpression(f)

    const predicate = parseParameterlessPredicate(parameters, expression)

    return createFilter(predicate, mapParameterNamesToTableAliases(parameters))
}