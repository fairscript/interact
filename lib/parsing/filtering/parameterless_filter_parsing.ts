import {extractLambdaParametersAndExpression} from '../javascript/lambda_parsing'
import {
    createConstantOrColumnSideParser,
    createPredicateExpressionParser,
    parsePredicate,
    PredicateExpression
} from '../filter_parsing'
import {mapParameterNamesToTableAliases} from '../../generation/table_aliases'

export function parseParameterlessPredicate(tableParameters: string[], expression: string): PredicateExpression {
    const sideParser = createConstantOrColumnSideParser(tableParameters)

    const parser = createPredicateExpressionParser(sideParser)

    return parsePredicate(parser, expression)
}

export interface ParameterlessFilter {
    tableParameterToTableAlias: {[parameter: string]: string}
    predicate: PredicateExpression
    kind: 'parameterless-filter'
}

export function createParameterlessFilter(
    tableParameterToTableAlias: { [p: string]: string },
    predicate: PredicateExpression): ParameterlessFilter {
    return {
        tableParameterToTableAlias,
        predicate,
        kind: 'parameterless-filter'
    }
}

export function parseParameterlessFilter(f: Function): ParameterlessFilter {
    const { parameters, expression } = extractLambdaParametersAndExpression(f)

    const tableParameterToTableAlias = mapParameterNamesToTableAliases(parameters)
    const predicate = parseParameterlessPredicate(parameters, expression)

    return createParameterlessFilter(tableParameterToTableAlias, predicate)
}