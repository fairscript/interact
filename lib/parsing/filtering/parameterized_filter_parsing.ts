import * as A from 'arcsecond'
import {extractLambdaParametersAndExpression} from '../javascript/lambda_parsing'
import {
    Filter
} from './filter_parsing'
import {
    createNestedObjectPropertyParser
} from '../javascript/record_parsing'
import {identifier} from '../javascript/identifier_parsing'
import {createGetProvided} from '../../column_operations'
import {mapParameterNamesToTableAliases} from '../../generation/table_aliases'
import {ValueOrNestedValueRecord} from '../../record'
import {
    createPredicateParser,
    parsePredicate,
    Predicate
} from '../predicates/predicate_parsing'
import {createConstantOrColumnSideParser} from '../predicates/side_parsing'

function createParameterSideParser(prefix: string, placeholderParameter: string) {
    return A.choice([
        createNestedObjectPropertyParser(A.str(placeholderParameter), identifier)
            .map(([object, path]) => createGetProvided(prefix, object, path)),
        A.str(placeholderParameter)
            .map(() => createGetProvided(prefix, placeholderParameter, [])),
    ])
}

function parseParameterizedPredicate(prefix: string, placeholderParameter: string, tableParameters: string[], expression: string): Predicate {
    const parameterSideParser = createParameterSideParser(prefix, placeholderParameter)
    const constantOrColumnSideParser = createConstantOrColumnSideParser(tableParameters)

    const parser = createPredicateParser(A.choice([parameterSideParser, constantOrColumnSideParser]))

    return parsePredicate(parser, expression)
}

export interface ParameterizedFilter {
    tableParameterToTableAlias: {[parameter: string]: string}
    predicate: Predicate
    userProvided: ValueOrNestedValueRecord
    kind: 'parameterized-filter'
}

export function createParameterizedFilter(
    tableParameterToTableAlias: { [p: string]: string },
    predicate: Predicate,
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