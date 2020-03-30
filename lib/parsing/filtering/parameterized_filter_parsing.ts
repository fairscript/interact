import * as A from 'arcsecond'
import {extractLambdaParametersAndExpression} from '../javascript/lambda_parsing'
import {
    createConstantOrColumnSideParser,
    createPredicateExpressionParser, Filter, parsePredicate,
    PredicateExpression
} from '../filter_parsing'
import {
    createNestedObjectPropertyParser
} from '../javascript/record_parsing'
import {identifier} from '../javascript/identifier_parsing'
import {createGetProvided} from '../../column_operations'
import {mapParameterNamesToTableAliases} from '../../generation/table_aliases'
import {ValueOrNestedValueRecord} from '../../record'

function createParameterSideParser(prefix: string, placeholderParameter: string) {
    return A.choice([
        createNestedObjectPropertyParser(A.str(placeholderParameter), identifier)
            .map(([object, path]) => createGetProvided(prefix, object, path)),
        A.str(placeholderParameter)
            .map(() => createGetProvided(prefix, placeholderParameter, [])),
    ])
}

function parseParameterizedPredicate(prefix: string, placeholderParameter: string, tableParameters: string[], expression: string): PredicateExpression {
    const parameterSideParser = createParameterSideParser(prefix, placeholderParameter)
    const constantOrColumnSideParser = createConstantOrColumnSideParser(tableParameters)

    const parser = createPredicateExpressionParser(A.choice([parameterSideParser, constantOrColumnSideParser]))

    return parsePredicate(parser, expression)
}

export interface ParameterizedFilter {
    tableParameterToTableAlias: {[parameter: string]: string}
    predicate: PredicateExpression
    userProvided: ValueOrNestedValueRecord
    kind: 'parameterized-filter'
}

export function createParameterizedFilter(
    tableParameterToTableAlias: { [p: string]: string },
    predicate: PredicateExpression,
    userProvided: ValueOrNestedValueRecord): ParameterizedFilter {

    return {
        tableParameterToTableAlias,
        predicate,
        userProvided,
        kind: 'parameterized-filter'
    }
}


export function parseParameterizedFilter(f: Function, prefix: string, userProvided: ValueOrNestedValueRecord): ParameterizedFilter {
    const {parameters, expression} = extractLambdaParametersAndExpression(f)

    const userProvidedParameter = parameters[0]
    const tableParameters = parameters.slice(1)

    const tableParameterToTableAlias = mapParameterNamesToTableAliases(tableParameters)
    const predicate = parseParameterizedPredicate(prefix, userProvidedParameter, tableParameters, expression)

    return createParameterizedFilter(tableParameterToTableAlias, predicate, userProvided)
}