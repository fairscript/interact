import {extractLambdaParametersAndExpression} from '../javascript/lambda_parsing'
import {mapParameterNamesToTableAliases} from '../../generation/table_aliases'
import {
    createPredicateParser,
    parsePredicate,
    Predicate
} from '../predicates/predicate_parsing'
import {createConstantOrGetColumnSideParser} from '../predicates/side_parsing'

export function parseParameterlessPredicate(tableParameters: string[], expression: string): Predicate {
    const sideParser = createConstantOrGetColumnSideParser(tableParameters)

    const parser = createPredicateParser(sideParser)

    return parsePredicate(parser, expression)
}

export interface ParameterlessFilter {
    tableParameterToTableAlias: {[parameter: string]: string}
    predicate: Predicate
    kind: 'parameterless-filter'
}

export function createParameterlessFilter(
    tableParameterToTableAlias: { [p: string]: string },
    predicate: Predicate): ParameterlessFilter {
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