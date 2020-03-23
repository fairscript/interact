import * as A from 'arcsecond'
import {extractLambdaParametersAndExpression} from '../javascript/lambda_parsing'
import {
    createConstantOrColumnSideParser, createFilter,
    createPredicateExpressionParser, Filter, parsePredicate,
    PredicateExpression
} from '../filter_parsing'
import {createNamedObjectPropertyParser} from '../javascript/record_parsing'
import {identifier} from '../javascript/identifier_parsing'
import {createGetParameter} from '../../column_operations'
import {mapParameterNamesToTableAliases} from '../../generation/table_aliases'

function createParameterSideParser(prefix: string, placeholderParameter: string) {
    return A.choice([
        createNamedObjectPropertyParser([placeholderParameter], identifier)
            .map(([object, property]) => createGetParameter(prefix, object, property)),
        A.str(placeholderParameter)
            .map(() => createGetParameter(prefix, placeholderParameter, null)),
    ])
}

function parseParameterizedPredicate(prefix: string, placeholderParameter: string|null, tableParameters: string[], expression: string): PredicateExpression {
    const parameterSideParser = createParameterSideParser(prefix, placeholderParameter)
    const constantOrColumnSideParser = createConstantOrColumnSideParser(tableParameters)

    const parser = createPredicateExpressionParser(A.choice([parameterSideParser, constantOrColumnSideParser]))

    return parsePredicate(parser, expression)
}

export function parseParameterizedFilter(f: Function, prefix: string): Filter {
    const {parameters, expression} = extractLambdaParametersAndExpression(f)

    const placeholderParameter = parameters[0]
    const tableParameters = parameters.slice(1)

    const predicate = parseParameterizedPredicate(prefix, placeholderParameter, tableParameters, expression)

    return createFilter(predicate, mapParameterNamesToTableAliases(tableParameters))
}